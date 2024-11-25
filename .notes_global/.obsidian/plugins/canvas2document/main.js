/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => Canvas2DocumentPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var path = __toESM(require("path"));
var Canvas2DocumentPlugin = class extends import_obsidian.Plugin {
  async onload() {
    if (this.app.vault.adapter instanceof import_obsidian.FileSystemAdapter) {
      this.fsadapter = this.app.vault.adapter;
    } else {
      return;
    }
    this.addCommand({
      id: "run-conversion",
      name: "Step 1 - Convert canvas to a longform document",
      callback: async () => {
        const canvStruct = await this.readCanvasStruct();
        if (canvStruct == false) {
          new import_obsidian.Notice(`this is not a canvas file`);
          return;
        }
        let [contents, myparsed_data] = await this.readCanvasData(canvStruct);
        const result = await this.writeCanvDocFile(contents, canvStruct, myparsed_data);
      }
    });
    this.addCommand({
      id: "run-redoc",
      name: "Step 2 - Clear canvas2document target document",
      callback: async () => {
        const canvStruct = await this.readC2Dtarget();
        if (canvStruct == false) {
          new import_obsidian.Notice(`this is not a canvas2document target file`);
          return;
        }
        this.writeC2Doc(canvStruct);
      }
    });
  }
  onunload() {
  }
  async readC2Dtarget() {
    let activeFile = this.app.workspace.getActiveFile();
    if (!activeFile || !activeFile.name.includes("_fromCanvas.md")) {
      return false;
    } else {
      let mdFolderPath = path.dirname(activeFile.path);
    }
    let content = this.app.vault.cachedRead(activeFile);
    return content;
  }
  async writeC2Doc(canvStruct) {
    let activeFile = this.app.workspace.getActiveFile();
    let mdFolderPath = path.dirname(activeFile.path);
    const pattern = /\!\[\[([^[\]]+)\]\]/g;
    const matches = canvStruct.match(pattern);
    let doccontentstring = "> [!success] This is your converted and cleared document from Canvas2Document\n> (you can delete this infobox)\n\n";
    if (!matches) {
      return;
    }
    let textfilenames = [];
    let filenames = [];
    matches.forEach((match) => {
      let embeddedfilename = match.replace(/\!\[\[(.*)\]\]/, "$1");
      if (embeddedfilename.endsWith(".md")) {
        if (embeddedfilename.startsWith("./")) {
          embeddedfilename = embeddedfilename.replace("./", "");
        }
        textfilenames.push(embeddedfilename);
      }
      filenames.push(embeddedfilename);
    });
    const fileContents = await Promise.all(
      textfilenames.map(
        async (file) => [file, await this.app.vault.cachedRead(this.app.vault.getAbstractFileByPath(file))]
      )
    );
    for (const xfile of filenames) {
      if (xfile.endsWith(".md")) {
        const found = fileContents.find((element) => element[0] == xfile);
        const { dir, name, ext } = path.parse(xfile);
        if (!dir.endsWith("_canvas2doc-data")) {
          doccontentstring += "# " + name + "\n\n";
        }
        doccontentstring += found[1] + "\n\n";
      } else {
        doccontentstring += "![[" + xfile + "]]\n\n";
      }
    }
    let docFilename;
    if (mdFolderPath == ".") {
      docFilename = activeFile.basename + "_fromC2D.md";
    } else {
      docFilename = mdFolderPath + "/" + activeFile.basename + "_fromC2D.md";
    }
    try {
      const exists = await this.fsadapter.exists(docFilename);
      if (exists) {
        const confirmed = await new Promise((resolve) => {
          const notice = new import_obsidian.Notice("File " + docFilename + " already exists. Overwrite?", 0);
          notice.noticeEl.createEl("button", { text: "Yes" }).onclick = () => {
            notice.hide();
            resolve(true);
          };
          notice.noticeEl.createEl("button", { text: "No" }).onclick = () => {
            notice.hide();
            resolve(false);
          };
        });
        if (!confirmed) {
          return false;
        }
      }
      await this.fsadapter.write(docFilename, doccontentstring);
    } catch (e) {
      console.log("error writing the new cleared doc file " + e);
    }
    const docftab = await this.app.vault.getAbstractFileByPath(docFilename);
    try {
      await this.app.workspace.getLeaf("split").openFile(docftab);
    } catch (e) {
      console.log(e);
    }
    return;
  }
  async readCanvasStruct() {
    let activeFile = this.app.workspace.getActiveFile();
    if (!activeFile || activeFile.extension != "canvas") {
      return false;
    } else {
      let mdFolderPath = path.dirname(activeFile.path);
    }
    let content = this.app.vault.cachedRead(activeFile);
    return content;
  }
  async findAllXChildren(startGeneration, myparsed_data, fileContents, handledNodes, limitrecurseNodes, runcounterfunc, runcounterforeach) {
    runcounterfunc++;
    if (runcounterfunc > 30) {
      return false;
    }
    for (const child of startGeneration) {
      runcounterforeach++;
      if (runcounterforeach > myparsed_data.edges2.length) {
        return false;
      }
      const nodeentry = myparsed_data.nodes.find((entry) => entry.id === child);
      if (!handledNodes.has(child)) {
        const result = await this.formatNode(nodeentry, 6);
        fileContents.push(result);
        handledNodes.add(child);
      } else {
        limitrecurseNodes++;
        if (limitrecurseNodes > 30) {
          return false;
        }
      }
      let children = myparsed_data.edges2.filter((edge) => edge.fromNode === child).map((edge) => edge.toNode);
      if (children.length > 0) {
        const continueRecursion = await this.findAllXChildren(children, myparsed_data, fileContents, handledNodes, limitrecurseNodes, runcounterfunc, runcounterforeach);
        if (!continueRecursion)
          return false;
      }
    }
    ;
    limitrecurseNodes++;
    return limitrecurseNodes <= 30;
  }
  async traverseNodes(initialNodes, myparsed_data, fileContents, handledNodes) {
    for (const node of initialNodes) {
      const nodeentry = myparsed_data.nodes.find((entry) => entry.id === node);
      if (!handledNodes.has(node)) {
        const result = await this.formatNode(nodeentry, 1);
        fileContents.push(result);
      }
      handledNodes.add(node);
      const children1 = myparsed_data.edges2.filter((edge) => edge.fromNode === node).map((edge) => edge.toNode);
      for (const child1 of children1) {
        const nodeentry2 = myparsed_data.nodes.find((entry) => entry.id === child1);
        if (!handledNodes.has(child1)) {
          const result = await this.formatNode(nodeentry2, 2);
          fileContents.push(result);
        }
        handledNodes.add(child1);
        const children2 = myparsed_data.edges2.filter((edge) => edge.fromNode === child1).map((edge) => edge.toNode);
        for (const child2 of children2) {
          const nodeentry3 = myparsed_data.nodes.find((entry) => entry.id === child2);
          if (!handledNodes.has(child2)) {
            const result = await this.formatNode(nodeentry3, 3);
            fileContents.push(result);
          }
          handledNodes.add(child2);
          const children3 = myparsed_data.edges2.filter((edge) => edge.fromNode === child2).map((edge) => edge.toNode);
          for (const child3 of children3) {
            const nodeentry4 = myparsed_data.nodes.find((entry) => entry.id === child3);
            if (!handledNodes.has(child3)) {
              const result = await this.formatNode(nodeentry4, 4);
              fileContents.push(result);
            }
            handledNodes.add(child3);
            const children4 = myparsed_data.edges2.filter((edge) => edge.fromNode === child3).map((edge) => edge.toNode);
            for (const child4 of children4) {
              const nodeentry5 = myparsed_data.nodes.find((entry) => entry.id === child4);
              if (!handledNodes.has(child4)) {
                const result = await this.formatNode(nodeentry5, 5);
                fileContents.push(result);
              }
              handledNodes.add(child4);
              const children5 = myparsed_data.edges2.filter((edge) => edge.fromNode === child4).map((edge) => edge.toNode);
              for (const child5 of children5) {
                const nodeentry6 = myparsed_data.nodes.find((entry) => entry.id === child5);
                if (!handledNodes.has(child5)) {
                  const result2 = await this.formatNode(nodeentry6, 6);
                  fileContents.push(result2);
                }
                handledNodes.add(child5);
                const children6 = myparsed_data.edges2.filter((edge) => edge.fromNode === child5).map((edge) => edge.toNode);
                let runcounterfunc = 0;
                let runcounterforeach = 0;
                let limitrecurseNodes = 0;
                const result = await this.findAllXChildren(children6, myparsed_data, fileContents, handledNodes, limitrecurseNodes, runcounterfunc, runcounterforeach);
              }
            }
          }
        }
      }
    }
  }
  async readCanvasData(struct) {
    const fileContents = [];
    let myparsed_data = JSON.parse(struct);
    const singleNodeIDs = /* @__PURE__ */ new Set();
    const groupNodes = /* @__PURE__ */ new Set();
    myparsed_data.nodes.forEach((node) => {
      if (node.type === "group") {
        groupNodes.add(node.id);
      } else {
        singleNodeIDs.add(node.id);
      }
    });
    const fromNodes = /* @__PURE__ */ new Set();
    const toNodes = /* @__PURE__ */ new Set();
    let groupClearedEdges = [];
    let resa = await myparsed_data.edges.forEach((edge) => {
      if (groupNodes.has(edge.fromNode) || groupNodes.has(edge.toNode)) {
      } else {
        fromNodes.add(edge.fromNode);
        toNodes.add(edge.toNode);
        groupClearedEdges.push(edge);
      }
    });
    myparsed_data.edges2 = groupClearedEdges;
    let handledNodes = /* @__PURE__ */ new Set();
    const skiphandledNodes = true;
    let nodesWithoutParents = [...singleNodeIDs].filter((node) => !toNodes.has(node));
    if (nodesWithoutParents.length === 0) {
      nodesWithoutParents = [...singleNodeIDs];
    }
    const traverseresult = await this.traverseNodes(nodesWithoutParents, myparsed_data, fileContents, handledNodes);
    const diff = new Set([...singleNodeIDs].filter((x) => !handledNodes.has(x)));
    if (diff.size > 0) {
      const traverseresult2 = await this.traverseNodes(diff, myparsed_data, fileContents, handledNodes);
    }
    return [fileContents, myparsed_data];
  }
  async formatNode(node, level) {
    const id = node.id;
    const type = node.type;
    let nodefile = "";
    if (type === "file") {
      nodefile = node.file;
      const { name, ext } = path.parse(nodefile);
      if (ext === ".md") {
        return [id, type, nodefile, level, "textfile", name];
      } else if (ext === ".canvas") {
        return [id, type, nodefile, level, "embeddedcanvas", name];
      } else if (ext === ".jpg" || ext == ".jpeg" || ext === ".png" || ext === ".gif") {
        return [id, type, nodefile, level, "contentimage", name + "." + ext];
      } else if (ext === ".mp3" || ext === ".wav" || ext === ".ogg") {
        return [id, type, nodefile, level, "contentaudio", name + "." + ext];
      } else if (ext === ".mp4" || ext === ".webm") {
        return [id, type, nodefile, level, "contentvideo", name + "." + ext];
      } else if (ext === ".pdf") {
        return [id, type, nodefile, level, "contentpdf", name + "." + ext];
      } else {
        return [id, type, nodefile, level, "xfile", name + "." + ext];
      }
    } else if (type === "link") {
      if (node.url.includes("youtube")) {
        const url = node.url;
        return [id, type, url, level, "contentyoutube", node.url];
      } else {
        return [id, type, node.url, level, "contentlink", node.url];
      }
    } else if (type === "text") {
      const text = node.text;
      const textPreview = text.substring(0, 100);
      return [id, type, "node", level, text, textPreview];
    }
  }
  async writeCanvDocFile(content, convStruct, myparsed_data) {
    let activeFile = this.app.workspace.getActiveFile();
    let mdFolderPath = path.dirname(activeFile.path);
    let writeworkdir = mdFolderPath + "/" + activeFile.basename + "_canvas2doc-data";
    this.fsadapter.mkdir(writeworkdir);
    let canvasFile;
    let canvasFilename;
    if (mdFolderPath == ".") {
      canvasFilename = activeFile.basename + "_fromCanvas.md";
    } else {
      canvasFilename = mdFolderPath + "/" + activeFile.basename + "_fromCanvas.md";
    }
    let contentString = "> [!info] This is an automatically generated document from Plugin [Canvas2Document](https://github.com/slnsys/obsidian-canvas2document)\n> arrange the document as you need with the outline, then call *Clear canvas2document target document*\n\n";
    for (const element of content) {
      let cnfname = "";
      let heading = "";
      for (let i = 0; i < element[3]; i++) {
        heading += "#";
      }
      if (element[1] == "text") {
        cnfname = writeworkdir + "/newdoc-node_" + element[0] + "_fromCanvas.md";
        contentString += "\n\n" + heading + " _card " + element[5] + "\n";
        contentString += element[2] + " ^" + element[0] + "\n\n";
        contentString += "> [!tip] link navigation from the canvas\n";
        for (const edge of myparsed_data.edges2) {
          if (edge.fromNode == element[0]) {
            const found = content.find((element2) => element2[0] == edge.toNode);
            const firstline = found[5].split("\n")[0];
            const found5 = firstline.replace(/#/g, "");
            contentString += "> linking to: [[#^" + edge.toNode + "|" + found5 + "]]\n";
          }
          if (edge.toNode == element[0]) {
            const found = content.find((element2) => element2[0] == edge.fromNode);
            const firstline = found[5].split("\n")[0];
            const found5 = firstline.replace(/#/g, "");
            contentString += "> linked from: [[#^" + edge.fromNode + "|" + found5 + "]]\n";
          }
        }
        contentString += "\n ![[" + cnfname + "]]\n\n";
        let canvasnodeFile;
        try {
          let cnfabst2 = this.app.vault.getAbstractFileByPath(cnfname);
          await this.fsadapter.write(cnfname, element[4]);
        } catch (e) {
          console.log(e);
          return;
        }
      } else if (element[1] == "link") {
        contentString += "\n\n" + heading + " _link " + element[5] + "\n";
        contentString += element[2] + " ^" + element[0] + "\n\n";
        contentString += "> [!tip] link navigation from the canvas\n";
        for (const edge of myparsed_data.edges2) {
          if (edge.fromNode == element[0]) {
            const found = content.find((element2) => element2[0] == edge.toNode);
            const firstline = found[5].split("\n")[0];
            const found5 = firstline.replace(/#/g, "");
            contentString += "> linking to: [[#^" + edge.toNode + "|" + found5 + "]]\n";
          }
          if (edge.toNode == element[0]) {
            const found = content.find((element2) => element2[0] == edge.fromNode);
            const firstline = found[5].split("\n")[0];
            const found5 = firstline.replace(/#/g, "");
            contentString += "> linked from: [[#^" + edge.fromNode + "|" + found5 + "]]\n";
          }
        }
        if (element[4] == "contentyoutube") {
          contentString += "\n ![](" + element[2] + ")\n\n";
        } else if (element[4] == "contentlink") {
          contentString += '\n <iframe src="' + element[2] + '"></iframe>\n\n';
        }
      } else if (element[1] == "file") {
        if (element[4] == "contentimage" || element[4] == "contentpdf") {
          contentString += "\n\n" + heading + " _Media " + element[5] + "\n";
          contentString += element[2] + " ^" + element[0] + "\n\n";
          contentString += "> [!tip] link navigation from the canvas\n";
          for (const edge of myparsed_data.edges2) {
            if (edge.fromNode == element[0]) {
              const found = content.find((element2) => element2[0] == edge.toNode);
              const firstline = found[5].split("\n")[0];
              const found5 = firstline.replace(/#/g, "");
              contentString += "> linking to: [[#^" + edge.toNode + "|" + found5 + "]]\n";
            }
            if (edge.toNode == element[0]) {
              const found = content.find((element2) => element2[0] == edge.fromNode);
              const firstline = found[5].split("\n")[0];
              const found5 = firstline.replace(/#/g, "");
              contentString += "> linked from: [[#^" + edge.fromNode + "|" + found5 + "]]\n";
            }
          }
          if (element[4] == "contentpdf") {
            contentString += "\n ![[" + element[2] + "#height=500]]\n\n";
          } else if (element[4] == "contentimage") {
            contentString += "\n ![[" + element[2] + "|500]]\n\n";
          }
        } else {
          contentString += "\n\n" + heading + " _noteFile " + element[5] + "\n";
          contentString += element[2] + " ^" + element[0] + "\n\n";
          contentString += "> [!tip] link navigation from the canvas\n";
          for (const edge of myparsed_data.edges2) {
            if (edge.fromNode == element[0]) {
              const found = content.find((element2) => element2[0] == edge.toNode);
              const firstline = found[5].split("\n")[0];
              const found5 = firstline.replace(/#/g, "");
              contentString += "> linking to: [[#^" + edge.toNode + "|" + found5 + "]]\n";
            }
            if (edge.toNode == element[0]) {
              const found = content.find((element2) => element2[0] == edge.fromNode);
              const firstline = found[5].split("\n")[0];
              const found5 = firstline.replace(/#/g, "");
              contentString += "> linked from: [[#^" + edge.fromNode + "|" + found5 + "]]\n";
            }
          }
          contentString += "\n ![[" + element[2] + "]]\n\n";
        }
      }
    }
    try {
      const exists = await this.fsadapter.exists(canvasFilename);
      if (exists) {
        const confirmed = await new Promise((resolve) => {
          const notice = new import_obsidian.Notice("File " + canvasFilename + " already exists. Overwrite?", 0);
          notice.noticeEl.createEl("button", { text: "Yes" }).onclick = () => {
            notice.hide();
            resolve(true);
          };
          notice.noticeEl.createEl("button", { text: "No" }).onclick = () => {
            notice.hide();
            resolve(false);
          };
        });
        if (!confirmed) {
          return false;
        }
      }
      await this.fsadapter.write(canvasFilename, contentString);
    } catch (e) {
      console.log("error writing the new doc file " + e);
    }
    const cnfabst = await this.app.vault.getAbstractFileByPath(canvasFilename);
    try {
      await this.app.workspace.getLeaf("split").openFile(cnfabst);
    } catch (e) {
      console.log(e);
    }
    return true;
  }
};


/* nosourcemap */