import { ChevronDown } from 'lucide-react';
import React from 'react'


function WelcomeScreen() {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-muted p-6">
          <ChevronDown className="h-12 w-12 rotate-45 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">WhatsApp for Windows</h2>
          <p className="text-muted-foreground">
            Send and receive messages without keeping your phone online.
            <br />
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }
  

export default WelcomeScreen