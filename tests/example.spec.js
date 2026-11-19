import { test, expect } from "@playwright/test";

// helper function

async function createTask(page, title, description) {
  await page.getByRole("button", { name: "Create New Task" }).click();

  await page.getByPlaceholder("Enter task title").fill(title);
  await page.getByPlaceholder("Enter task description").fill(description);

  await page.getByRole("button", { name: "Create" }).click();
}

// helper function
function getTaskItem(page, title, description) {
  return page
    .getByRole("listitem")
    .filter({ hasText: title })
    .filter({ hasText: description });
}

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});

/* Test 1 – Skapa uppgift

Öppna applikationen.

Fyll i titel och beskrivning.

Klicka på knappen för att skapa uppgiften.

Kontrollera att uppgiften visas i listan.

*/

test("Creates a task", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await createTask(page, "Go to gym", "Train back");

  const createdTask = getTaskItem(page, "Go to gym", "Train back");
  await expect(createdTask).toBeVisible();
});

/* Test 2 – Slutför uppgift

Skapa en uppgift.

Ändra statusen till Slutförd.

Kontrollera att rätt status visas.

*/

test("Checks that the user can change between pending and completed status", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");

  await createTask(page, "Go to gym", "Train back");

  const taskItem = getTaskItem(page, "Go to gym", "Train back");

  await taskItem.getByRole("button", { name: "Mark as completed" }).click();
  await expect(
    taskItem.getByRole("button", { name: "Mark as pending" }),
  ).toBeVisible();
});

/* Test 3 – Ta bort uppgift

Skapa en uppgift.

Ta bort uppgiften.

Kontrollera att den inte längre visas i listan.


Testerna ska kunna köras automatiskt utan manuella steg. */

test("Checks that the user can delete a task", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await createTask(page, "Go to gym", "Train back");
  const taskItem = getTaskItem(page, "Go to gym", "Train back");

  await taskItem.getByRole("button", { name: "Delete Task" }).click();

  await expect(taskItem).not.toBeVisible();
});

test("Checks that tasks remain after reload", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await createTask(page, "Go to gym", "Train back");
  const taskItem = getTaskItem(page, "Go to gym", "Train back");

  await taskItem.getByRole("button", { name: "Mark as completed" }).click();

  await page.reload();
  const reloadedTask = getTaskItem(page, "Go to gym", "Train back");
  await expect(reloadedTask).toBeVisible();
  await expect(
    reloadedTask.getByRole("button", { name: "Mark as pending" }),
  ).toBeVisible();
});

test("Checks error handling for storage", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage is full");
    };
  });

  await createTask(page, "Go to gym", "Train back");
  await expect(getTaskItem(page, "Go to gym", "Train back")).toBeVisible();
  await createTask(
    page,
    "Take Thomas to basketball practice",
    "He needs to be there by 9",
  );
  await expect(
    getTaskItem(
      page,
      "Take Thomas to basketball practice",
      "He needs to be there by 9",
    ),
  ).toBeVisible();

  await expect(page.getByRole("alert")).toHaveText(
    "Could not save tasks to localStorage",
  );
});
