export default function ucfirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.substring(1, value.length);
}
