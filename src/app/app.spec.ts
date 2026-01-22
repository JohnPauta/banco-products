import { render, screen } from '@testing-library/angular';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App component', () => {
  it('should create the app', async () => {
    const { fixture } = await render(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title', async () => {
    await render(App);
    expect(screen.getByText(/Hello, banco-products/i)).toBeTruthy();
  });
});
