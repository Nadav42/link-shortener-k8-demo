import { app } from "./app";
import { ILink, linkService } from './link-service';

const transformLink = (link?: ILink) => {
    if (!link) {
        return link
    }

    return { alias: link.alias, url: link.url };
}

app.get("/api/v1/links", async (req, res) => {
    const links = await linkService.getAllLinks();
    res.json(links.map(transformLink));
});

app.get("/api/v1/links/:alias", async (req, res) => {
    const link = await linkService.getLink(req.params.alias);

    if (!link) {
        return res.status(404).json({ msg: "link does not exist" });
    }

    res.json(transformLink(link));
});

app.post("/api/v1/links", async (req, res) => {
    const alias = req.body?.alias;
    const url = req.body?.url;
    const password = req.body?.password;

    if (!alias || !url) {
        return res.status(400).json({ msg: "missing or invalid params", params: req.body });
    }

    if (!(await linkService.verifyPassword(alias, password))) {
        return res.status(401).json({ msg: "wrong password", params: req.body });
    }

    const link = await linkService.upsertLink(alias, url, password);
    res.json(transformLink(link));
});

app.post("/api/v1/links/delete", async (req, res) => {
    const alias = req.body?.alias;
    const password = req.body?.password;

    if (!alias) {
        return res.status(400).json({ msg: "missing or invalid params", params: req.body });
    }

    if (!(await linkService.verifyPassword(alias, password))) {
        return res.status(401).json({ msg: "wrong password", params: req.body });
    }

    await linkService.removeLink(alias, password);
    res.json({ success: true });
});

app.use("/:alias", async (req, res, next) => {
    const alias = req.params?.alias;
    const link = await linkService.getLink(alias);

    if (link && link.url) {
        return res.redirect(link.url);
    }

    return res.status(404).json({ msg: "link does not exist" });
});