import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { KanbanGrid } from "../kanban-grid";
import { Item, Priority, Status } from "@/generated/prisma";
import { DialogContentNewItem } from "../dialog-new-item";
import { GroupWithItems } from "../../main-board/groups";
import { updateItem } from "@/app/actions/item";

// Mock dependencies
jest.mock("../dialog-new-item", () => ({
    DialogContentNewItem: jest.fn(() => <div data-testid="dialog-new-item-mock" />)
}));
jest.mock("../../main-board/info-item", () => ({
    InfoItem: jest.fn(() => <div data-testid="info-item-mock" />)
}));

const mockUpdateItem = updateItem as jest.Mock;

const createMockItem = (id: string, title: string, status: Status): Item => ({
    id, title, status,
    priority: "MEDIUM" as Priority,
    term: new Date(),
    notes: "",
    description: "",
    groupId: "g1",
    createdAt: new Date(),
    updatedAt: new Date(),
});

const mockGroupsData: GroupWithItems[] = [
    {
        id: "g1",
        title: "Group 1",
        item: [
            createMockItem("item-1", "Task 1", "NOT_STARTED"),
            createMockItem("item-2", "Task 2", "IN_PROGRESS"),
        ]
    } as GroupWithItems,
];

// Add a testid to the card to make it selectable
jest.mock("@/components/ui/card", () => {
    const original = jest.requireActual("@/components/ui/card");
    return {
        ...original, // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Card: (props: Record<string, any>) => <original.Card {...props} data-testid="card" />,
    };
});

describe("KanbanGrid Component", () => {
    beforeAll(() => {
        // Mock global DataTransfer
        class DataTransferMock {
            effectAllowed = "";
            dropEffect = "";
            setDragImage = jest.fn();
            setData = jest.fn();
            getData = jest.fn();
        }

        Object.defineProperty(window, "DataTransfer", {
            value: DataTransferMock,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Evita que o removeChild quebre quando o elemento já foi removido
        jest.spyOn(document.body, "removeChild").mockImplementation((el) => {
            if (document.body.contains(el)) {
                return HTMLElement.prototype.removeChild.call(document.body, el);
            }
            return el;
        });
    });

    afterEach(() => {
        // Limpa elementos de preview de drag que podem ter sido criados
        document.querySelectorAll('[style*="position: absolute"]').forEach(el => {
            try {
                if (el.parentNode && document.body.contains(el)) {
                    el.parentNode.removeChild(el);
                }
            } catch (error) {
                // Ignora erros se o elemento já foi removido
            }
        });
    });

    it("should render columns and items correctly", () => {
        render(<KanbanGrid groupsData={mockGroupsData} />);
        expect(screen.getByText(/Em Progresso.*\(1\)/)).toBeInTheDocument();
        expect(screen.getByText(/Não Iniciado.*\(1\)/)).toBeInTheDocument();
        expect(screen.getByText("Task 1")).toBeInTheDocument();
        expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("should call updateItem on drop", async () => {
        mockUpdateItem.mockResolvedValue({});
        render(<KanbanGrid groupsData={mockGroupsData} />);

        const itemToDrag = screen.getByText("Task 1").closest(".kanban-item");
        const dropColumn = screen.getByText(/Em Progresso \(1\)/).closest("[data-testid=card]");

        // JSDOM doesn't implement dataTransfer, so we create a mock
        const dataTransfer = {
            effectAllowed: "move",
            dropEffect: "move",
            setDragImage: jest.fn(),
        };

        fireEvent.dragStart(itemToDrag!, { dataTransfer });
        fireEvent.dragOver(dropColumn!, { dataTransfer });
        fireEvent.drop(dropColumn!, { dataTransfer });

        await waitFor(() => {
            expect(mockUpdateItem).toHaveBeenCalledWith(expect.objectContaining({
                itemId: "item-1",
                status: "IN_PROGRESS",
            }));
        });
    });

    it("should open the new item dialog with the correct status", async () => {
        render(<KanbanGrid groupsData={mockGroupsData} />);

        // Limpa as chamadas anteriores do render
        (DialogContentNewItem as jest.Mock).mockClear();

        // Encontra o card "Não Iniciado" pelo título e depois o botão Plus dentro dele
        const notStartedCard = screen.getByText(/Não Iniciado \(1\)/).closest("[data-testid=card]");
        const addButton = notStartedCard?.querySelector("button");

        expect(addButton).toBeInTheDocument();
        fireEvent.click(addButton!);

        // Aguarda a atualização do estado e verifica a última chamada
        await waitFor(() => {
            const lastCall = (DialogContentNewItem as jest.Mock).mock.calls[(DialogContentNewItem as jest.Mock).mock.calls.length - 1];
            expect(lastCall[0]).toMatchObject({ status: "NOT_STARTED" });
        });
    });

    it("should update drag state visually during drag operation", () => {
        render(<KanbanGrid groupsData={mockGroupsData} />);

        const itemToDrag = screen.getByText("Task 1").closest(".kanban-item");

        // Antes do drag
        expect(itemToDrag).not.toHaveClass("opacity-50");

        const dataTransfer = {
            effectAllowed: "move",
            setDragImage: jest.fn(),
        };

        // Durante o drag
        fireEvent.dragStart(itemToDrag!, { dataTransfer });

        expect(itemToDrag).toHaveClass("opacity-50");
    });

    it("should not call updateItem if item is dropped in the same column", async () => {
        mockUpdateItem.mockResolvedValue({});
        render(<KanbanGrid groupsData={mockGroupsData} />);

        // Usa getAllByText e pega o elemento dentro do kanban-item
        const allTask1Elements = screen.getAllByText("Task 1");
        const itemToDrag = allTask1Elements.find(el =>
            el.closest(".kanban-item")
        )?.closest(".kanban-item");

        const sameColumn = screen.getByText(/Não Iniciado \(1\)/).closest("[data-testid=card]");

        const dataTransfer = {
            effectAllowed: "move",
            dropEffect: "move",
            setDragImage: jest.fn(),
        };

        fireEvent.dragStart(itemToDrag!, { dataTransfer });
        fireEvent.drop(sameColumn!, { dataTransfer });

        // Aguarda um pouco para garantir que nenhuma chamada assíncrona aconteça
        await waitFor(() => {
            expect(mockUpdateItem).not.toHaveBeenCalled();
        }, { timeout: 100 });
    });
});