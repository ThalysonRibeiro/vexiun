import { render } from "@testing-library/react";
import { Priorities } from "../priorities";
import { getPriorities } from "@/app/data-access/item";
import { PrioritiesCount } from "@/app/data-access/item/get-priorities";
import { PrioritiesBar } from "../../workspace/[id]/_components/priorities-bar";


jest.mock("@/app/data-access/item/get-priorities");
jest.mock("../../workspace/[id]/_components/priorities-bar", () => ({
  PrioritiesBar: jest.fn(() => <div data-testid="priorities-bar" />),
}));


const mockGetPriorities = getPriorities as jest.MockedFunction<typeof getPriorities>;
const mockPrioritiesBar = PrioritiesBar as jest.Mock;

const mockPriorities: PrioritiesCount[] = [
  { priority: "CRITICAL", count: 1, },
  { priority: "HIGH", count: 2, },
];


describe("Priorities component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render priorities with correct props when data is fetched successfully", async () => {
    mockGetPriorities.mockResolvedValue(mockPriorities);
    const Component = await Priorities({ workspaceId: "workspace-01" });
    render(Component as React.ReactElement);

    expect(mockGetPriorities).toHaveBeenCalledWith("workspace-01");
    expect(mockPrioritiesBar).toHaveBeenCalledWith(expect.objectContaining({ priorities: mockPriorities, label: false }), undefined);
  });

  it("should render with an empty array when no priorities are found", async () => {
    mockGetPriorities.mockResolvedValue([]);
    const Component = await Priorities({ workspaceId: "workspace-01" });
    render(Component);

    expect(mockGetPriorities).toHaveBeenCalledWith("workspace-01");
    expect(mockPrioritiesBar).toHaveBeenCalledWith(expect.objectContaining({ priorities: [], label: false }), undefined);

  });
})