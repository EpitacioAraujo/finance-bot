export function zodErrorFormatter(errors: any) {
    return errors.issues.reduce((acc, issue) => {
        const field = issue.path.join('.');
        acc[field] = issue.message;
        return acc;
    }, {} as Record<string, string>);
}