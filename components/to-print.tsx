import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentsProps {
  month: number;
  date: string;
  principalPayment: number;
  interestPayment: number;
  remainingPrincipal: number;

}
interface ComponentProps{
  totalPayment: number;
  payments: PaymentsProps[]
}


const ToPrint = ({totalPayment, payments}: ComponentProps) => {

  const formatCurrency = (value: number) => {
    return (
      value
        .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        .replace("R$", "")
        .replace(/\./g, " ")
        .replace(",", ".") + " MT"
    );
  };
  return (
    <Table>
    <TableCaption>Historico de pagamentos.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Nr. Prest</TableHead>
        <TableHead>Data de Pagamento</TableHead>
        <TableHead>Pagamento principal</TableHead>
        <TableHead>Juros</TableHead>
        <TableHead className="text-right">
          Saldo restante
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {payments.map((payment) => (
        <TableRow key={payment.month}>
          <TableCell className="font-medium">
            {payment.month}
          </TableCell>
          <TableCell>{payment.date}</TableCell>
          <TableCell>
            {formatCurrency(payment.principalPayment)}
          </TableCell>
          <TableCell className="text-right">
            {formatCurrency(payment.interestPayment)}
          </TableCell>

          <TableCell className="text-right">
            {formatCurrency(payment.remainingPrincipal)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={4}>Total</TableCell>
        <TableCell className="text-right">
          {" "}
          {formatCurrency(totalPayment)}
        </TableCell>
      </TableRow>
    </TableFooter>
  </Table>
  );
};

export default ToPrint;