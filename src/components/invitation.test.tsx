import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Invitation } from "../routes/index";
import FullInvitation, { Rsvp } from "./full-invitation";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe("guest invitation", () => {
  it("opens the invitation and provides an invitation link", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Invitation />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Countdown to the wedding"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Your full name")).not.toBeInTheDocument();
    expect(document.querySelector("audio")).toBeNull();
    await user.click(screen.getByRole("button", { name: /Tap to open/ }));
    expect(
      await screen.findByRole("link", { name: /View invitation/ }),
    ).toHaveAttribute("href", "#invitation");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  });
  it("starts music within the opening tap and allows retry when playback is blocked", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValueOnce(new DOMException("Blocked", "NotAllowedError"))
      .mockImplementation(function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event("playing"));
        return Promise.resolve();
      });
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const { unmount } = render(<Invitation />);
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Tap to open/ }));
    // Playback must start synchronously, before the lazy invitation mounts.
    expect(play).toHaveBeenCalledTimes(1);
    expect(play.mock.instances[0]).toHaveProperty("loop", true);
    expect(await screen.findByRole("status")).toHaveTextContent("Tap the music button");
    fireEvent.click(screen.getByRole("button", { name: "Play background music" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pause background music" })).toHaveAttribute("aria-pressed", "true"));
    expect(play).toHaveBeenCalledTimes(2);
    expect(screen.queryByText(/Music could not play/)).not.toBeInTheDocument();
    unmount();
    expect(pause).toHaveBeenCalled();
  });
  it("reveals the date and advances the countdown", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-04T03:00:00Z"));
    render(<FullInvitation />);
    const countdown = screen.getByLabelText("Countdown to the wedding");
    expect(countdown).toHaveTextContent("01DAYS");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(countdown).toHaveTextContent("00DAYS23HOURS59MINS59SECS");
    fireEvent.click(
      screen.getByRole("button", { name: /Tap to reveal our date/ }),
    );
    expect(document.querySelector(".date-reveal")).toHaveTextContent(
      "December52026",
    );
  });
});
describe("RSVP", () => {
  it.each(["Joyfully accept", "Maybe", "Regretfully decline"])(
    "completes %s locally without sending a request",
    async (choice) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const user = userEvent.setup();
      render(<Rsvp />);
      expect(screen.getByText(/Your response is not sent or saved/)).toBeInTheDocument();
      await user.click(screen.getByLabelText(choice));
      await user.type(screen.getByLabelText("Your full name"), "Aditi Desai");
      await user.click(screen.getByRole("button", { name: /Complete response/ }));
      expect(screen.getByRole("status")).toHaveTextContent("Thank you, Aditi Desai.");
      expect(screen.getByRole("status")).toHaveTextContent("Please contact the hosts directly");
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("requires a celebration for an acceptance", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<Rsvp />);
    await user.type(screen.getByLabelText("Your full name"), "Aditi Desai");
    for (const checkbox of screen.getAllByRole("checkbox")) {
      await user.click(checkbox);
    }
    await user.click(screen.getByRole("button", { name: /Complete response/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose at least one celebration.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
