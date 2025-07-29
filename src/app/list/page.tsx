"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import KeyCustomerManager from "./KeyCustomerManager";
import Header from "@/components/header";

export default function Page() {

  return (
    
    <div >
            <Header title="Doanh nghiệp trọng điểm"></Header>

      <KeyCustomerManager />
    </div>
  );
}


