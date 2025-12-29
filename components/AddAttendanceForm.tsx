"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./Input";
import { Select } from "./Select";
import { Button } from "./Button";
import { useCreateAttendance } from "@/lib/queries/attendanceQueries";
import { useCenters } from "@/lib/queries/membersQueries";
import { useToast } from "./Toast";

const attendanceSchema = z.object({
    date: z.string().min(1, "Please select a date"),
    service_type: z.enum(["Sunday Service", "FTN Bible Study", "Prayer Meeting"], {
        errorMap: () => ({ message: "Please select a service type" }),
    }),
    center_id: z.string().min(1, "Please select a center"),
    adult_male: z.number().min(0, "Must be 0 or more"),
    adult_female: z.number().min(0, "Must be 0 or more"),
    child_male: z.number().min(0, "Must be 0 or more"),
    child_female: z.number().min(0, "Must be 0 or more"),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export interface AddAttendanceFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddAttendanceForm({ onSuccess, onCancel }: AddAttendanceFormProps) {
    const { toast } = useToast();
    const { data: centers = [], isLoading: loadingCenters } = useCenters();
    const createAttendance = useCreateAttendance();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AttendanceFormData>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            adult_male: 0,
            adult_female: 0,
            child_male: 0,
            child_female: 0,
        },
    });

    const onSubmit = async (data: AttendanceFormData) => {
        try {
            await createAttendance.mutateAsync(data);
            toast({
                title: "Attendance Recorded",
                message: "Service attendance has been successfully saved.",
                type: "success",
            });
            onSuccess();
        } catch (error) {
            toast({
                title: "Recording Failed",
                message: error instanceof Error ? error.message : "An error occurred.",
                type: "error",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Date"
                    type="date"
                    {...register("date")}
                    error={errors.date?.message}
                    disabled={isSubmitting}
                />

                <Select
                    label="Service Type"
                    placeholder="Select service"
                    options={[
                        { value: "Sunday Service", label: "Sunday Service" },
                        { value: "FTN Bible Study", label: "FTN Bible Study" },
                        { value: "Prayer Meeting", label: "Prayer Meeting" },
                    ]}
                    {...register("service_type")}
                    error={errors.service_type?.message}
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

                <div className="md:col-span-2 border-t pt-2 mt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Attendance Breakdown</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                            label="Adult Male"
                            type="number"
                            {...register("adult_male", { valueAsNumber: true })}
                            error={errors.adult_male?.message}
                            disabled={isSubmitting}
                        />
                        <Input
                            label="Adult Female"
                            type="number"
                            {...register("adult_female", { valueAsNumber: true })}
                            error={errors.adult_female?.message}
                            disabled={isSubmitting}
                        />
                        <Input
                            label="Children (Boy)"
                            type="number"
                            {...register("child_male", { valueAsNumber: true })}
                            error={errors.child_male?.message}
                            disabled={isSubmitting}
                        />
                        <Input
                            label="Children (Girl)"
                            type="number"
                            {...register("child_female", { valueAsNumber: true })}
                            error={errors.child_female?.message}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
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
                    Save Attendance
                </Button>
            </div>
        </form>
    );
}
