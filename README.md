# UPI QR Code Generator

A modern, single-page web application for generating UPI QR codes with a beautiful animated background and 3D effects.

## Features

- **UPI Form Input**
  - Virtual Payment Address (VPA)
  - Amount (optional)
  - Payee Name
  - Remark (limited to 15 characters)

- **QR Code Generation**
  - Modern, stylish QR code design
  - Mobile-friendly
  - Download options (PNG and PDF)

- **UI/UX Features**
  - Animated background with interactive elements
  - 3D card effects
  - Responsive design for all devices
  - Beautiful transitions and animations

## Technologies Used

- **Next.js 15** - React framework for server-rendered applications
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - UI component library
- **Framer Motion** - Animation library
- **React Hook Form & Zod** - Form handling and validation
- **qrcode.react** - QR code generation
- **jsPDF & html2canvas** - PDF generation

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/upi_qr_code_generator.git
   cd upi_qr_code_generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter your UPI details in the form
2. Click "Generate QR Code"
3. Scan the generated QR code with any UPI-enabled app
4. Download the QR code as PNG or PDF if needed

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [QRCode.react](https://www.npmjs.com/package/qrcode.react)
