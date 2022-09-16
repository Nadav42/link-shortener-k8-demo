import { app } from "./app";
import { linkService } from './link-service';

app.get("/api/v1/links", async (req, res) => {
    const links = await linkService.getAllLinks();
    res.json(links);
});

app.get("/api/v1/links/:alias", async (req, res) => {
    const link = await linkService.getLink(req.params.alias);

    if (!link) {
        return res.status(401).json({ msg: "link does not exist" });
    }

    res.json(link);
});

app.post("/api/v1/links", async (req, res) => {
    const alias = req.body?.alias;
    const url = req.body?.url;

    if (!alias || !url) {
        return res.status(400).json({ msg: "missing or invalid params", params: req.body });
    }

    const link = await linkService.upsertLink(alias, url);
    res.json(link);
});

app.use("/:alias", async (req, res, next) => {
    const alias = req.params?.alias;
    const link = await linkService.getLink(alias);

    if (link && link.url) {
        return res.redirect(link.url);
    }

    return res.status(401).json({ msg: "link does not exist" });
});