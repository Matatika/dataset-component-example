interface IDataset {
    id: number;
    source: string;
    published: string;
    viewCount: number;
    title: string;
    questions: string;
    description: string;
    visualisation: any;
    metadata?: any;
    rawData: string;
    likeCount: number;
    _links?: any;
    _embedded: any;
    alias?: string;
    deleteLoading?: boolean;
}

export default IDataset
