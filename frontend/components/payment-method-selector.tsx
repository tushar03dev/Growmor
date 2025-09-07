"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Shield, Zap } from "lucide-react"

export function PaymentMethodSelector() {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Why Choose UPI Payment?</h3>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <CardTitle className="text-sm">Instant</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Payments are processed instantly, no waiting time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            <CardTitle className="text-sm">Secure</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Bank-grade security with 2-factor authentication</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-blue-500" />
                            <CardTitle className="text-sm">Convenient</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Pay directly from your mobile banking app</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                    No Extra Charges
                </Badge>
                <Badge variant="secondary" className="text-xs">
                    24/7 Available
                </Badge>
                <Badge variant="secondary" className="text-xs">
                    All Banks Supported
                </Badge>
            </div>
        </div>
    )
}
