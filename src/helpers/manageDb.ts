import fs from "fs/promises";
import path from "path";

const manageFiles = async () => {
  const dataFolder = path.join(process.cwd(), "data");

  try {
    const files = await fs.readdir(dataFolder);

    const fileStats = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(dataFolder, filename);
        const stat = await fs.stat(filePath);
        return {
          name: filename,
          mtime: stat.mtime,
        };
      }),
    );

    if (fileStats.length > 11) {
      fileStats
        .filter((file) => !file.name.includes("initialConfig"))
        .sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

      const filesToDelete = fileStats
        .slice(0, fileStats.length - 11)
        .map((file) => file.name);

      await Promise.all(
        filesToDelete.map(async (filename) => {
          const filePath = path.join(dataFolder, filename);
          await fs.unlink(filePath);
          console.log(`Deleted file: ${filename}`);
        }),
      );

      console.log("Old files cleaned up successfully.");
    } else {
      console.log("File count is within the limit. No files deleted.");
    }
  } catch (err) {
    console.error("Error managing files:", err);
  }
};

export default manageFiles;
