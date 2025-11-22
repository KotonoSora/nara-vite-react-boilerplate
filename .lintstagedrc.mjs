export default {
  '**/*.{ts,tsx}': (filenames) => {
    const escapedFilenames = filenames.map(filename => `"${filename}"`).join(' ');
    return [
      'bun run typecheck',
      'bun run lint',
      `bun run test --run --silent 'passed-only' --passWithNoTests related ${escapedFilenames}`
    ];
  }
};
