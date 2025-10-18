import "./globals.css";
import { Roboto } from 'next/font/google';
import ClientThemeWrapper from "./ClientThemeWrapper";

const roboto = Roboto({ subsets: ['latin'], weight: ['100', '900'], display: 'swap' });

export const metadata = {
    title: "VolverDB",
    description: "Gestor de ventas para comercios",
    icons: {
        icon: './favicon.ico',
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className={`${roboto.className} antialiased`}>
                <ClientThemeWrapper>{children}</ClientThemeWrapper>
            </body>
        </html>
    );
}