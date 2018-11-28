import Handlebars from "handlebars";
import PluginError from "plugin-error";
import path from "path";
import filesLoader from "./filesLoader";

function helpersLoader(paths) {
    let helperFiles = filesLoader(paths, "**/*.js");

    for (let i in helperFiles) {
        let basename = path.basename(helperFiles[i], ".js");

        try {
            if (Handlebars.helpers[basename]) {
                delete require.cache[require.resolve(helperFiles[i])];
                Handlebars.unregisterHelper(basename);
            }

            Handlebars.registerHelper(basename, require(helperFiles[i]));
        } catch (error) {
            let errorData = {
                fileName: helperFiles[i],
                message: "Error in helpers at " + error.loc.line + ":" + error.loc.column,
                stack: error.codeFrame
            }
            throw new PluginError("iungo", errorData);
        }
    }
}

export default helpersLoader;
