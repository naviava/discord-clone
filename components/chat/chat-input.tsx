"use client";

import { memo, useCallback, useMemo } from "react";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { Plus, Smile } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import useModal from "@/hooks/use-modal-store";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  const isLoading = useMemo(
    () => form.formState.isSubmitting,
    [form.formState.isSubmitting],
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const url = qs.stringifyUrl({
          url: apiUrl,
          query,
        });

        await axios.post(url, values);
        form.reset();
      } catch (err) {
        console.log(err);
      }
    },
    [apiUrl, query, form],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  {/* File upload button. */}
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  {/* Chat input field. */}
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    {...field}
                  />
                  {/* Emoji keyboard. */}
                  <div className="absolute right-8 top-7">
                    <Smile />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default memo(ChatInput);
