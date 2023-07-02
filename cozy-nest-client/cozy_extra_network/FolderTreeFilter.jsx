import React, {useEffect} from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import TreeView, { flattenTree } from "react-accessible-treeview";
import './FolderTreeFilter.scss'

// const folder = {
//     name: "",
//     children: [
//         {
//             name: "src",
//             children: [{ name: "index.js" }, { name: "styles.css" }],
//         },
//         {
//             name: "node_modules",
//             children: [
//                 {
//                     name: "react-accessible-treeview",
//                     children: [{ name: "index.js" }],
//                 },
//                 { name: "react", children: [{ name: "index.js" }] },
//             ],
//         },
//         {
//             name: ".npmignore",
//         },
//         {
//             name: "package.json",
//         },
//         {
//             name: "webpack.config.js",
//         },
//     ],
// };
//
// const data = flattenTree(folder);

export function FolderTreeFilter({folders}) {

    const data = flattenTree(folders)

    if (data.length <= 0) {
        return (
            <div className="EmptyFolderTreeFilter"></div>
        )
    }

    return (
        <div className="FolderTreeFilter">
            <div className="directory">
                <TreeView
                    data={data}
                    aria-label="directory tree"
                    nodeRenderer={({
                                       element,
                                       isBranch,
                                       isExpanded,
                                       getNodeProps,
                                       level,
                                   }) => (
                        <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
                            {isBranch ? (
                                <FolderIcon isOpen={isExpanded} />
                            ) : (
                                <FileIcon filename={element.name} />
                            )}

                            {element.name}
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

const FolderIcon = ({ isOpen }) =>
    isOpen ? (
        <FaRegFolderOpen color="e8a87c" className="icon" />
    ) : (
        <FaRegFolder color="e8a87c" className="icon" />
    );

const FileIcon = ({ filename }) => {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    switch (extension) {
        case "js":
            return <DiJavascript color="yellow" className="icon" />;
        case "css":
            return <DiCss3 color="turquoise" className="icon" />;
        case "json":
            return <FaList color="yellow" className="icon" />;
        case "npmignore":
            return <DiNpm color="red" className="icon" />;
        default:
            return null;
    }
};
