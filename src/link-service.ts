interface ILink {
    alias: string;
    url: string;
}

// using async because it's a db mock, will move to db in the future without changing the api
class LinkService {
    private links: ILink[] = [];

    async getAllLinks() {
        return this.links;
    }

    async getLink(alias: string) {
        return this.links.find(link => link.alias === alias);
    }

    async upsertLink(alias: string, url: string) {
        const linkExists = await this.getLink(alias);

        if (linkExists) {
            await this.removeLink(alias);
        }

        this.links.push({ alias, url });
        return this.getLink(alias);
    }

    async removeLink(alias: string) {
        this.links = this.links.filter(link => link.alias !== alias);
    }
}

export const linkService = new LinkService();