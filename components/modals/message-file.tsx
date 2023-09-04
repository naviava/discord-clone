"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useModal from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachment is required." }),
});

export default function MessageFileModal() {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const { apiUrl, query } = useMemo(() => data, [data]);

  const isModalOpen = useMemo(
    () => isOpen && type === "messageFile",
    [isOpen, type],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { fileUrl: "" },
  });

  const isLoading = useMemo(
    () => form.formState.isSubmitting,
    [form.formState.isSubmitting],
  );

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query,
        });

        await axios.post(url, { ...values, content: values.fileUrl });
        form.reset();
        router.refresh();
        handleClose();
      } catch (err) {
        console.log(err);
      }
    },
    [form, router, apiUrl, query, handleClose],
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <main className="space-y-8 px-6">
              {/* Image uploader. */}
              <section className="flex items-center justify-center">
                <FormField
                  name="fileUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </section>
            </main>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
