/* eslint-disable @next/next/no-img-element */
"use client";
import Lottie from "lottie-react";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";

import animation from "../public/animations/loan.json";
import { addMonths, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";

export default function Home() {
  const [sliderValue, setSliderValue] = useState<number[]>([1000]);
  const [interestValue, setInterestValue] = useState<number[]>([58]);
  const [monthsValue, setMonthsValue] = useState("2");
  const [clientName, setClientName] = useState("");
  const componentRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handleServiceWorker = async () => {
        await navigator.serviceWorker.register("/service-worker.js");
      };

      handleServiceWorker();
    }
  }, []);

  const handlePrint = () => {
    if (!clientName) {
      toast("Nome do cliente", {
        description: "Digite o nome do cliente",
      });
    } else {
      print();
      setOpen(false);
    }
  };
  const print = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (value > 5000000) {
      toast("Limite atingido", {
        description: "Só pode efetuar empréstimo até 5000.000,00",
        action: {
          label: "Entendi",
          onClick: () => (value = 5000000),
        },
      });
      value = 5000000;
    }
    setSliderValue([value]);
  };
  const handleInterest = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (value > 100) {
      toast("Limite atingido", {
        description: "Só pode efetuar interesse de 100%",
        action: {
          label: "Entendi",
          onClick: () => (value = 100),
        },
      });
      value = 500000;
    }
    setInterestValue([value]);
  };

  const Months = () => {
    const month = [];
    for (let i = 1; i <= 60; i++) {
      month.push({
        month: i,
      });
    }

    return {
      month: month,
    };
  };

  // Função para calcular os pagamentos
  const calculateLoan = () => {
    let principal = sliderValue[0];
    const months = parseInt(monthsValue, 10);
    const interestRate = interestValue[0] / 100; // convertendo a taxa de juros para decimal

    const monthlyInterestRate = interestRate / 12;
    const monthlyPayment =
      (principal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -months));
    const totalPayment = monthlyPayment * months;

    const payments = [];
    let currentDate = new Date(); // Data atual
    currentDate = addMonths(currentDate, 1); // Começar a partir do próximo mês
    let totalInterest = 0;
    for (let i = 1; i <= months; i++) {
      const interestPayment = principal * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      principal -= principalPayment;
      totalInterest += interestPayment;

      payments.push({
        month: i,
        date: format(currentDate, "dd/MM/yyyy"),
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        remainingPrincipal: principal,
      });

      currentDate = addMonths(currentDate, 1); // Avançar para o próximo mês
    }

    return {
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      payments: payments,
      interest: totalInterest,
    };
  };

  // Calcular os pagamentos
  const { monthlyPayment, totalPayment, payments, interest } = calculateLoan();
  const { month } = Months();

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
    <main className="h-full md:p-8 relative">
      <ModeToggle />

      <img
        className="absolute h-60 w-60 -top-20 -left-28 lg:-top-20 lg:-left-20"
        src="/flower.png"
        alt="FUTURO-flowe"
      />
      <div className="wrapper">
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="flex flex-col gap-2 items-center justify-center">
            <Image
              className="hidden dark:block"
              width={80}
              height={80}
              src={"/logo3.png"}
              alt="FUTURO"
            />
            <Image
              className="dark:hidden"
              width={80}
              height={80}
              src={"/logo.png"}
              alt="FUTURO"
            />
            <h1 className="text-base md:text-xl font-bold">
              FUTURO Loan Calculator
            </h1>
          </div>
          <p className="text-xs md:text-base text-muted-foreground">
            Faça a sua simulação de empréstimo aqui
          </p>
          <div className="w-full h-[2px] bg-secondary mb-6 mt-16 max-md:mt-12"></div>

          <div className="grid lg:grid-cols-2 w-full gap-4">
            <div className="grid gap-4 self-start">
              <h1 className="text-sm md:text-base">Quanto você quer?</h1>
              <div className="relative p-4 grid gap-2 border border-secondary rounded">
                <Input
                  type="number"
                  value={sliderValue[0]}
                  onChange={handleChange}
                />
                <Slider
                  className="absolute -bottom-1"
                  min={1000}
                  defaultValue={[5000]}
                  value={sliderValue}
                  max={5000000}
                  step={1}
                  onValueChange={(values: number[]) => setSliderValue(values)}
                />
              </div>

              <h1 className="text-sm md:text-base">Taxas de juro anual</h1>
              <div className="relative p-4 grid gap-2 border  border-secondary rounded">
                <p>Percentagem: {interestValue[0]}%</p>

                <Input
                  type="number"
                  value={interestValue[0]}
                  onChange={handleInterest}
                />
                <Slider
                  className="absolute -bottom-1"
                  min={1}
                  defaultValue={[58]}
                  max={100}
                  step={1}
                  value={interestValue}
                  onValueChange={(values: number[]) => setInterestValue(values)}
                />
              </div>
              <h1 className="text-sm md:text-base">Em quantos meses?</h1>
              <Input
                value={monthsValue}
                placeholder="Digite a quantidade de meses"
                type="number"
                onChange={(e) => setMonthsValue(e.target.value)}
              />

              <div className="hidden lg:grid rounded p-2 bg-muted gap-1">
                <span className="text-xs md:text-base text-muted-foreground">
                  A pagar mensalmente:{" "}
                  <span className="font-bold text-secondary-foreground">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </span>
                <span className="text-xs md:text-base text-muted-foreground">
                  Total interest:{" "}
                  <span className="font-bold text-secondary-foreground">
                    {formatCurrency(interest)}
                  </span>
                </span>
                <span className="text-xs md:text-base text-muted-foreground">
                  Total a pagar :{" "}
                  <span className="font-bold text-secondary-foreground">
                    {formatCurrency(totalPayment)}
                  </span>
                </span>
              </div>
            </div>
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dados do cliente</DialogTitle>
                    <DialogDescription>
                      Preencha o nome do cliente para completar a simulação
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Digite o nome do cliente"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  <Button onClick={handlePrint}>Imprimir</Button>
                </DialogContent>
              </Dialog>

              <div className="md:hidden max-h-[400px] overflow-y-scroll">
                <div>
                  <div className="p-4 flex justify-between">
                    <div>
                      <Image
                        width={80}
                        height={80}
                        src={"/logo.png"}
                        alt="FUTURO"
                      />
                    </div>
                    <div className="text-right text-xs md:text-base">
                      {clientName && (
                        <h1 className="font-bold text-muted-foreground">
                          Cliente:{clientName}
                        </h1>
                      )}
                      <h1 className="font-bold text-muted-foreground">
                        Valor a levar:{formatCurrency(sliderValue[0])}
                      </h1>
                      <h1 className="font-bold text-muted-foreground">
                        A pagar mensalmente:{formatCurrency(monthlyPayment)}
                      </h1>
                      <h1 className="font-bold text-muted-foreground">
                        Total interest:{formatCurrency(interest)}
                      </h1>
                      <h1 className="font-bold text-muted-foreground">
                        Total a pagar:{formatCurrency(totalPayment)}
                      </h1>
                    </div>
                  </div>

                  <Table>
                    <TableCaption>
                      Historico de pagamentos para o cliente.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>A pagar</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">
                          Saldo restante
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="w-full">
                      {payments.map((payment) => (
                        <TableRow key={payment.month}>
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
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(totalPayment)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
              <div className="hidden md:block max-h-[400px] overflow-y-scroll">
                <div ref={componentRef}>
                  <div className="p-4 flex justify-between">
                    <div>
                      <Image
                        width={80}
                        height={80}
                        src={"/logo.png"}
                        alt="FUTURO"
                      />
                    </div>
                    <div className="text-right text-xs md:text-base">
                      {clientName && (
                        <h1 className="text-muted-foreground text-xs">
                          Cliente:{clientName}
                        </h1>
                      )}
                      <h1 className="text-muted-foreground text-xs">
                        Valor a levar:{formatCurrency(sliderValue[0])}
                      </h1>
                      <h1 className="text-muted-foreground text-xs">
                        A pagar mensalmente:{formatCurrency(monthlyPayment)}
                      </h1>
                      <h1 className="text-muted-foreground text-xs">
                        Total interest:{formatCurrency(interest)}
                      </h1>
                      <h1 className="text-muted-foreground text-xs">
                        Total a pagar:{" "}
                        <span className="font-bold text-secondary-foreground">
                          {formatCurrency(totalPayment)}
                        </span>
                      </h1>
                    </div>
                  </div>

                  <Table>
                    <TableCaption>
                      Historico de pagamentos para o cliente.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Nr.Prest</TableHead>
                        <TableHead className="text-xs">
                          Data de Pagamento
                        </TableHead>
                        <TableHead className="text-xs">
                          Pagamento principal
                        </TableHead>
                        <TableHead className="text-right text-xs">
                          Interest
                        </TableHead>
                        <TableHead className="text-right text-xs">
                          Saldo restante
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="w-full">
                      {payments.map((payment) => (
                        <TableRow key={payment.month}>
                          <TableCell className="text-xs">
                            {payment.month}
                          </TableCell>
                          <TableCell className="text-xs">
                            {payment.date}
                          </TableCell>
                          <TableCell className="text-xs">
                            {formatCurrency(payment.principalPayment)}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {formatCurrency(payment.interestPayment)}
                          </TableCell>

                          <TableCell className="text-right text-xs">
                            {formatCurrency(payment.remainingPrincipal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right text-xs font-bold">
                          {formatCurrency(totalPayment)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
              <div className="flex">
                <Button onClick={() => setOpen(true)} className="mt-2 w-full">
                  Imprimir historico de pagamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
