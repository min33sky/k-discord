export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-blue-700 h-full text-white">{children}</div>;
}
