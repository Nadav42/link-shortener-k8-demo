export interface ILink {
    alias: string;
    url: string;
    password?: string;
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

    async upsertLink(alias: string, url: string, password: string) {
        const linkExists = await this.getLink(alias);

        if (!(await this.verifyPassword(alias, password))) {
            return;
        }

        if (linkExists) {
            await this.removeLink(alias, password);
        }

        this.links.push({ alias, url, password });
        return this.getLink(alias);
    }

    async removeLink(alias: string, password: string) {
        if (!(await this.verifyPassword(alias, password))) {
            return;
        }

        const linkExists = await this.getLink(alias);
        this.links = this.links.filter(link => link.alias !== alias);
        return linkExists;
    }

    async verifyPassword(alias: string, password: string): Promise<boolean> {
        const linkExists = await this.getLink(alias);

        if (!linkExists || !linkExists.password) {
            return true;
        }

        if (!linkExists.password && !password) {
            return true;
        }

        return linkExists.password === password;
    }
}

export const linkService = new LinkService();