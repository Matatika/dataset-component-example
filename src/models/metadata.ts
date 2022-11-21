interface RelatedTable {
    columns: Column[];
    aggregates?: Aggregate[];
}
interface Link {
    title: string;
    dataset: string;
}
interface Aggregate {
    name: string;
    label: string;
    description: string;
    links?: Link[];
}
interface Column {
    name: string;
    label: string;
    description: string;
}

export interface IMetaDataProps {
    version?: number;
    name?: string;
    label?: string;
    related_table?: RelatedTable;
    links?: Link[];
    palette?: number[][];
}
