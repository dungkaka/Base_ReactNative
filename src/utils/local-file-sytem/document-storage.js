const { LocalFileSystem, sendData, sendError } = require("./local-file-system");

const writeAsync = async (dir, fileName, content) => {
    try {
        await LocalFileSystem.writeAsync("document")(dir, fileName, content, (content) => JSON.stringify(content));
        return {
            status: true,
            message: "Write file successful !",
        };
    } catch (error) {
        return sendError(error);
    }
};

const readAsync = async (dir, fileName) => {
    try {
        const data = await LocalFileSystem.readAsync("document")(dir, fileName, (content) => JSON.parse(content));
        return { status: true, data: data };
    } catch (error) {
        return sendError(error);
    }
};

const deleteAsync = async (dir, fileName) => {
    try {
        await LocalFileSystem.deleteAsync("document")(dir, fileName);
        return { status: true };
    } catch (error) {
        return sendError(error);
    }
};

const readDirAsync = async (dir) => {
    try {
        const files = await LocalFileSystem.readDirAsync("document")(dir);
        return { status: true, files };
    } catch (error) {
        return sendError(error);
    }
};

const deleteAllAsync = async () => {
    try {
        const { files } = await readDirAsync();
        for (let dir of files) {
            await deleteAsync("", dir);
        }
        return { status: true };
    } catch (error) {
        return sendError(error);
    }
};

export const DocumentStorage = {
    writeAsync,
    readAsync,
    deleteAsync,
    readDirAsync,
    deleteAllAsync,
};
