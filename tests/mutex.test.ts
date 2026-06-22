import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Mutex } from "../src/lib/mutex";

describe("Mutex", () => {
  it("is locked after acquire", async () => {
    const mutex = new Mutex();
    expect(mutex.isLocked()).toBe(false);
    await mutex.acquire();
    expect(mutex.isLocked()).toBe(true);
    mutex.release();
  });

  it("is unlocked after release", async () => {
    const mutex = new Mutex();
    await mutex.acquire();
    mutex.release();
    expect(mutex.isLocked()).toBe(false);
  });

  it("runExclusive acquires and releases", async () => {
    const mutex = new Mutex();
    expect(mutex.isLocked()).toBe(false);
    await mutex.runExclusive(async () => {
      expect(mutex.isLocked()).toBe(true);
    });
    expect(mutex.isLocked()).toBe(false);
  });

  it("runExclusive returns result", async () => {
    const mutex = new Mutex();
    const result = await mutex.runExclusive(async () => {
      return "success";
    });
    expect(result).toBe("success");
  });

  it("runExclusive handles errors gracefully", async () => {
    const mutex = new Mutex();
    let caughtError: unknown = null;
    try {
      await mutex.runExclusive(async () => {
        throw new Error("test error");
      });
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toBeInstanceOf(Error);
    expect((caughtError as Error).message).toBe("test error");
    expect(mutex.isLocked()).toBe(false);
  });

  it("mutex is fair (FIFO)", async () => {
    const mutex = new Mutex();
    const order: string[] = [];

    const acquireAndRelease = (name: string) =>
      mutex.runExclusive(() => {
        order.push(name);
        return Promise.resolve();
      });

    await acquireAndRelease("first");
    await acquireAndRelease("second");
    expect(order).toEqual(["first", "second"]);
  });

  it("concurrent calls are serialized", async () => {
    const mutex = new Mutex();
    const order: string[] = [];

    const promises = [
      mutex.runExclusive(() => {
        order.push("a");
        return Promise.resolve();
      }),
      mutex.runExclusive(() => {
        order.push("b");
        return Promise.resolve();
      }),
    ];

    await Promise.all(promises);
    expect(order).toEqual(["a", "b"]);
  });

  it("isLocked returns correct state", async () => {
    const mutex = new Mutex();
    expect(mutex.isLocked()).toBe(false);
    await mutex.acquire();
    expect(mutex.isLocked()).toBe(true);
    mutex.release();
    expect(mutex.isLocked()).toBe(false);
  });
});
