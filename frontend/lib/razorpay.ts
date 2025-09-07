declare global {
    interface Window {
        Razorpay: any
    }
}

export interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: any) => void
    prefill: {
        name: string
        email: string
        contact: string
    }
    notes: Record<string, string>
    theme: {
        color: string
    }
    method: {
        upi: boolean
        card: boolean
        netbanking: boolean
        wallet: boolean
    }
}

export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export const initiateRazorpayPayment = async (options: RazorpayOptions): Promise<void> => {
    const isLoaded = await loadRazorpayScript()

    if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK")
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
}
