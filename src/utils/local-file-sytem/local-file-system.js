import Exception from "@utils/exceptions/Exception";
import * as FileSystem from "expo-file-system";

// Create path of file
const fsPath = (path, type = "cache") => {
    const rootDir = type == "document" ? FileSystem.documentDirectory : FileSystem.cacheDirectory;
    return rootDir + path;
};

// Check and create if dir is not exist
const ensureDirExists = async (dir) => {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
};

// Write, replace entire content of File
const writeAsync =
    (type = "cache") =>
    async (dir, relativePathFile = "", content, encodeFunc = (v) => v, options) => {
        const dirPath = fsPath(dir, type);
        const fileUri = dirPath + "/" + relativePathFile;
        await ensureDirExists(dirPath);
        if (!content) throw new Error("Can not write undefined content !");
        await FileSystem.writeAsStringAsync(fileUri, encodeFunc(content));
    };

// Read file
const readAsync =
    (type = "cache") =>
    async (dir = "", relativePathFile = "", decodeFunc = (v) => v) => {
        const dirPath = fsPath(dir, type);
        const fileUri = dirPath + "/" + relativePathFile;

        const fileInfor = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfor.exists) throw new Exception(404, "File not exist !");
        const data = await FileSystem.readAsStringAsync(fileUri);
        return decodeFunc(data);
    };

// List name of all files in dir
const readDirAsync =
    (type = "cache") =>
    async (dir = "") => {
        const dirPath = fsPath(dir, type);
        const files = await FileSystem.readDirectoryAsync(dirPath);
        return files;
    };

// Delete file or folder
const deleteAsync =
    (type = "cache") =>
    async (dir, relativePathFile = "", options) => {
        const dirPath = fsPath(dir, type);
        const fileUri = dirPath + "/" + relativePathFile;
        await FileSystem.deleteAsync(fileUri);
    };

// https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_20mb.mp4

// Downloads multiple Dir
// const addMultipleFile = async (dir, urls) => {
//     try {
//         await ensureDirExists(dir);

//         console.log("Downloading", urls.length, " files... !");

//         await Promise.all(urls.map((url) => FileSystem.downloadAsync(url, fsPath(url))));
//     } catch (e) {
//         console.error("Couldn't download files:", e);
//     }
// };

export const LocalFileSystem = {
    writeAsync,
    readAsync,
    readDirAsync,
    deleteAsync,
};

export const sendData = (data) => data;
export const sendError = (error) => ({
    status: false,
    code: error.code,
    message: error.message,
});
