#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import {
  readPackageVersion,
  patchSkillMdFile,
} from "../bin/skill-version-patch.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillMd = path.join(root, "skills", "cyango-mcp", "SKILL.md");
const version = readPackageVersion(root);
patchSkillMdFile(skillMd, version);
