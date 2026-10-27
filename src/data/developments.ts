export type Development = {
 slug: string;
 name: string;
 city: string;
 state: string;
 neighborhood: string;
 stage: "planned" | "building" | "delivered";
 description: string;
 highlights: string[];
 images: { url: string; alt: string }[];
 delivery?: string;
};
// Populate only with project information and images approved by the client.
export const developments: Development[] = [];
export const developmentStageLabels = { planned: "Em planejamento", building: "Em construção", delivered: "Entregue" };
