import { render, screen } from "@testing-library/react";
import MetricsPage from "../page";
import { GoalMetrics } from "../_types";
import { MetricsContent } from "../_components/metrics-content";
import { getGoalsMetrics } from "@/app/data-access/goals/get-metrics";

jest.mock("@/app/data-access/goals/get-metrics");
jest.mock("../_components/metrics-content", () => ({
  MetricsContent: jest.fn(({ data }) => (
    <div data-testid="metrics-content" data-props={JSON.stringify(data)} />
  )),
}));

const mockGetGoalsMetrics = getGoalsMetrics as jest.Mock;
const mockMetricsContent = MetricsContent as jest.Mock;

describe("MetricsPage", () => {
  beforeEach(() => {
    mockGetGoalsMetrics.mockClear();
    mockMetricsContent.mockClear();
  });

  it("should fetch metrics and pass them to MetricsContent", async () => {
    const mockData: GoalMetrics = {
      weeklyProgress: [],
      monthlyProgress: [],
      completedWeeks: [],
      incompletedWeeks: [],
    };
    mockGetGoalsMetrics.mockResolvedValue(mockData);

    const Page = await MetricsPage();
    render(Page);

    expect(getGoalsMetrics).toHaveBeenCalledTimes(1);
    expect(mockMetricsContent).toHaveBeenCalledTimes(1);
    expect((mockMetricsContent as jest.Mock).mock.calls[0][0]).toEqual({ data: mockData });
  });

  it("should pass null to MetricsContent when no metrics are returned", async () => {
    mockGetGoalsMetrics.mockResolvedValue(null);

    const Page = await MetricsPage();
    render(Page);

    expect(getGoalsMetrics).toHaveBeenCalledTimes(1);
    expect(mockMetricsContent).toHaveBeenCalledTimes(1);
    expect((mockMetricsContent as jest.Mock).mock.calls[0][0]).toEqual({ data: null });
  });
});
