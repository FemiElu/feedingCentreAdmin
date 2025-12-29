"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./Input";
import { Select } from "./Select";
import { Button } from "./Button";
import { useCreateMember, useCenters } from "@/lib/queries/membersQueries";
import { useToast } from "./Toast";
import {
    SERVICE_UNITS,
    GENDER_OPTIONS,
    MARITAL_STATUS_OPTIONS,
} from "@/lib/constants";

const memberSchema = z.object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    center_id: z.string().min(1, "Please select a center"),
    service_unit: z.string().min(1, "Please select a service unit"),
    gender: z.string().min(1, "Please select a gender"),
    marital_status: z.string().min(1, "Please select marital status"),
    dob: z.string().min(1, "Please select date of birth"),
});

type MemberFormData = z.infer<typeof memberSchema>;

export interface AddMemberFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddMemberForm({ onSuccess, onCancel }: AddMemberFormProps) {
    const { toast } = useToast();
    const { data: centers = [], isLoading: loadingCenters } = useCenters();
    const createMember = useCreateMember();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MemberFormData>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            gender: "",
            marital_status: "",
            service_unit: "",
            center_id: "",
        },
    });

    const onSubmit = async (data: MemberFormData) => {
        try {
            await createMember.mutateAsync(data);
            toast({
                title: "Member Created",
                message: `${data.full_name} has been successfully added.`,
                type: "success",
            });
            onSuccess();
        } catch (error) {
            toast({
                title: "Creation Failed",
                message: error instanceof Error ? error.message : "An error occurred while creating the member.",
                type: "error",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Full Name"
                    placeholder="e.g. Tunde Olaoluwa"
                    {...register("full_name")}
                    error={errors.full_name?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. john@example.com"
                    {...register("email")}
                    error={errors.email?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Phone Number"
                    placeholder="e.g. +234..."
                    {...register("phone")}
                    error={errors.phone?.message}
                    disabled={isSubmitting}
                />
                <Input
                    label="Date of Birth"
                    type="date"
                    {...register("dob")}
                    error={errors.dob?.message}
                    disabled={isSubmitting}
                />
                <Select
                    label="Gender"
                    placeholder="Select gender"
                    options={GENDER_OPTIONS}
                    {...register("gender")}
                    error={errors.gender?.message}
                    disabled={isSubmitting}
                />
                <Select
                    label="Marital Status"
                    placeholder="Select status"
                    options={MARITAL_STATUS_OPTIONS}
                    {...register("marital_status")}
                    error={errors.marital_status?.message}
                    disabled={isSubmitting}
                />
                <Select
                    label="Center"
                    placeholder={loadingCenters ? "Loading centers..." : "Select center"}
                    options={centers.map((c) => ({ value: c.id, label: c.name }))}
                    {...register("center_id")}
                    error={errors.center_id?.message}
                    disabled={isSubmitting || loadingCenters}
                />
                <Select
                    label="Service Unit"
                    placeholder="Select unit"
                    options={SERVICE_UNITS.map((u) => ({ value: u, label: u }))}
                    {...register("service_unit")}
                    error={errors.service_unit?.message}
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Create Member
                </Button>
            </div>
        </form>
    );
}
