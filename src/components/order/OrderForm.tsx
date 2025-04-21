"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  productType: z.string().min(1, "Vui lòng chọn loại sản phẩm"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
  deliveryDate: z.string().min(1, "Vui lòng chọn ngày giao hàng"),
  notes: z.string().optional(),
});

export function OrderForm() {
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      productType: "",
      quantity: 1,
      notes: "",
    },
  });

  const onSubmit = (data: z.infer<typeof orderFormSchema>) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container relative w-full max-w-[800px] h-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
          <div className="order-box w-full max-w-[700px] mx-auto text-center my-6 md:my-10 px-4">
            <h2 className="text-white text-2xl font-semibold mb-4">
              Đặt đơn hàng
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">
                          Tên khách hàng
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-white/50 text-white placeholder:text-white/70"
                            placeholder="Nhập tên khách hàng"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">
                          Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-white/50 text-white placeholder:text-white/70"
                            placeholder="Nhập số điện thoại"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">
                          Loại sản phẩm
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-transparent border-white/50 text-white">
                              <SelectValue placeholder="Chọn loại sản phẩm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cake">Bánh kem</SelectItem>
                            <SelectItem value="bread">Bánh mì</SelectItem>
                            <SelectItem value="cookie">Bánh quy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">
                          Số lượng
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-transparent border-white/50 text-white placeholder:text-white/70"
                            placeholder="Nhập số lượng"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">
                          Ngày giao hàng
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-transparent border-white/50 text-white placeholder:text-white/70"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">
                          Ghi chú
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-white/50 text-white placeholder:text-white/70"
                            placeholder="Nhập ghi chú (nếu có)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Đặt hàng
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
