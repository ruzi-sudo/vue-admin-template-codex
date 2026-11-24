import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { FakeRouteConfig } from "vite-plugin-fake-server/client";

const modules = import.meta.glob<FakeRouteConfig>("../mock/**/*.fake.ts", {
  eager: true,
  import: "default"
});

describe("Mock module structure", () => {
  it("keeps handlers and data in the corresponding API module", () => {
    const paths = Object.keys(modules);
    expect(paths.length).toBeGreaterThan(0);

    for (const path of paths) {
      const match = path.match(
        /^\.\.\/mock\/([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\/route\.fake\.ts$/
      );
      expect(match, `Invalid Mock handler path: ${path}`).not.toBeNull();
      if (!match) continue;

      const model = match[1];
      for (const file of [
        `../src/api/${model}/route.ts`,
        `../src/api/${model}/types.ts`,
        `../mock/${model}/data.ts`
      ]) {
        expect(existsSync(new URL(file, import.meta.url)), file).toBe(true);
      }
    }
  });

  it("registers each method and URL only once across modules", () => {
    const registered = new Set<string>();

    for (const config of Object.values(modules)) {
      const routes = Array.isArray(config) ? config : [config];
      for (const route of routes) {
        const key = `${(route.method ?? "get").toUpperCase()} ${route.url}`;
        expect(registered.has(key), `Duplicate Mock endpoint: ${key}`).toBe(
          false
        );
        registered.add(key);
      }
    }
  });
});
