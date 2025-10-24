// https://minecraft.wiki/w/Data_component_format
// //*[@id="mw-content-text"]/div[1]/div[9]/ul
// //*[@id="mw-content-text"]/div[1]/div[9]/ul/li[1]/span/a/span

import * as xpath from "xpath";
import { DOMParser } from "@xmldom/xmldom";
import fs from "fs";

let xml = fs.readFileSync('script/component.xml', 'utf-8');
var doc = new DOMParser().parseFromString(xml, 'text/xml');
var nodes = xpath.select("//ul/li/span/a/span", doc) as Node[]
let data = nodes.map(n=>n.textContent)
let output = `export type COMPONENTS = ${data.map(d=>`'${d}'`).join(' | ')};\n`
output += `export type EXCL_COMPONENTS = ${data.map(d=>`'!${d}'`).join(' | ')};\n`
fs.writeFileSync('src/enum/extend/component.ts', output)
