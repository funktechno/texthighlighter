import { task, src, dest } from "gulp";
import ts from "gulp-typescript";
 
task("build", function () {
    return src("src/**/*.ts")
        .pipe(ts({
            noImplicitAny: true,
            outFile: "TextHighlighter.js"
        }))
        .pipe(dest("dist"));
});