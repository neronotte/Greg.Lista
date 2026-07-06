import { test, expect } from '@playwright/test';
import path from 'path';

test.use({
  storageState: path.join(__dirname, '../.auth/test01.json'),
});

test('crea e poi elimina una lista', async ({ page }) => {
  const listName = `Test lista ${Date.now()}`;

  // --- Home page ---
  await page.goto('/');
  await expect(page).toHaveURL('/');

  // Apre il bottom sheet "Nuova lista" tramite il FAB
  await page.getByRole('button', { name: 'Nuova lista' }).click();

  // Compila il form
  const input = page.getByPlaceholder('es. Spesa settimanale');
  await expect(input).toBeVisible();
  await input.fill(listName);

  // Conferma la creazione
  await page.getByRole('button', { name: 'Crea' }).click();

  // Attende che il bottom sheet si chiuda e la lista compaia nell'elenco
  await expect(input).not.toBeVisible();
  const listLink = page.getByRole('link', { name: new RegExp(listName) });
  await expect(listLink).toBeVisible();

  // --- Dettaglio lista ---
  await listLink.click();
  await expect(page).toHaveURL(/\/lists\//);
  await expect(page.getByRole('heading', { name: listName })).toBeVisible();

  // Apre il dialog di conferma eliminazione
  await page.getByRole('button', { name: 'Elimina lista' }).click();
  const dialog = page.getByRole('dialog', { name: 'Elimina lista' });
  await expect(dialog).toBeVisible();

  // Conferma l'eliminazione
  await dialog.getByRole('button', { name: 'Elimina' }).click();

  // Dopo l'eliminazione torna alla home e la lista non è più presente
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: new RegExp(listName) })).not.toBeVisible();
});
