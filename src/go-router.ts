import { app } from "./app";
import { ILink, linkService } from './link-service';

const transformLink = (link?: ILink) => {
    if (!link) {
        return link
    }

    return { alias: link.alias, url: link.url, passwordHint: link.passwordHint };
}

app.get("/api/v1/go-links", async (req, res) => {
    const links = await linkService.getAllLinks();
    res.json(links.map(transformLink));
});

app.get("/api/v1/go-links/:alias", async (req, res) => {
    const link = await linkService.getLink(req.params.alias);

    if (!link) {
        return res.status(404).json({ msg: "link does not exist" });
    }

    res.json(transformLink(link));
});

app.post("/api/v1/go-links", async (req, res) => {
    const alias = req.body?.alias;
    const url = req.body?.url;
    const password = req.body?.password;
    const passwordHint = req.body?.passwordHint;

    if (!alias || !url) {
        return res.status(400).json({ msg: "missing or invalid params", params: req.body });
    }

    if (!(await linkService.verifyPassword(alias, password))) {
        return res.status(401).json({ msg: "wrong password", params: req.body });
    }

    const link = await linkService.upsertLink(alias, url, password, passwordHint);
    res.json(transformLink(link));
});

app.post("/api/v1/go-links/delete", async (req, res) => {
    const alias = req.body?.alias;
    const password = req.body?.password;

    if (!alias) {
        return res.status(400).json({ msg: "missing or invalid params", params: req.body });
    }

    if (!(await linkService.verifyPassword(alias, password))) {
        return res.status(401).json({ msg: "wrong password", params: req.body });
    }

    const removedLink = await linkService.removeLink(alias, password);

    if (!removedLink) {
        return res.status(404).json({ msg: "link does not exist and can not be deleted" });
    }

    res.json(transformLink(removedLink));
});

app.use("/:alias", async (req, res, next) => {
    const alias = req.params?.alias;
    const link = await linkService.getLink(alias);

    if (link && link.url) {
        return res.redirect(link.url);
    }

    return res.status(404).json({ msg: "link does not exist" });
});