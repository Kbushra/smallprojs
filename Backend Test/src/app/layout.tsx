import type { Metadata } from "next";

export const metadata: Metadata =
{
    title: "Backend Test",
    description: "Testing out a backend with Next.js",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>)
{
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
