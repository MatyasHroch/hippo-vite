export type Context = {
    addVariable: Function;
    addVariablesTyped: Function;
    variables: Record<string, any>;
    parent: Context | null;
    templatePath?: string;
}