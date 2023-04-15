import express from "express";
import fileUpload from "express-fileupload";
import { upload, getFiles, getFile, downloadFile, getFileUrl } from './s3.js'

const app = express();

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "./uploads"
}));

app.get("/", (_req, res) => { res.json({ message: "Hello" }) });

app.get("/files", async (_req, res) => {
  const files = await getFiles();
  res.json(files.Contents);
})

app.get("/files/:id", async (req, res) => {
  const file = await getFile(req.params.id);
  res.json(file.$metadata);
})

app.get("/download/:id", async (req, res) => {
  await downloadFile(req.params.id);
  res.json({ message: "Download file" })
})

app.get("/getUrl/:id", async (req, res) => {
  const url = await getFileUrl(req.params.id);
  res.json({ url: url })
})

app.post("/upload", async (req, res) => {
  console.log('req.files:', req.files);
  const up = await upload(req.files.file, req.files.file.name);
  res.json({ up });
});

app.listen(3000);