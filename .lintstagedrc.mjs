export default {
  "(app|database|workers)/**/*.{ts,tsx}": (filenames) => {
    const quotedFiles = filenames.map((file) => `"${file}"`).join(" ");
    return [
      "bun run typecheck",
      "bun run lint",
      quotedFiles
        ? `bun run test -- --run --silent --passWithNoTests related ${quotedFiles}`
        : "bun run test -- --run --silent --passWithNoTests",
    ];
  },
};
