// read thru folder 
// for each file add to array
//
import fs from "fs"
import path from "path"

let videofiles = []
let audiofiles = []
function read_files_intoarray(p, arr) {
	fs.readdirSync(p).forEach((file) => arr.push(path.join(p, file)))
}

read_files_intoarray("./clips/", videofiles)
read_files_intoarray("./clips2/", videofiles)

read_files_intoarray("./audio/", audiofiles)

let str = JSON.stringify({ videofiles, audiofiles }, null, 2)
fs.writeFileSync("./data.json", str)

