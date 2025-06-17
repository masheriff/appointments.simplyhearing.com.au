// src/components/booking/CustomerDetailsForm.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { CustomerForm } from '@/types/booking';

const customerFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  birthdate: z.date({
    required_error: 'Birth date is required',
  }).refine(date => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 1 && age <= 120 && date <= today;
  }, 'Please enter a valid birth date'),
  email: z.string().email('Please enter a valid email address'),
  mobilePhone: z.string()
    .min(1, 'Mobile phone is required')
    .regex(/^(\+61|0)[0-9]{9}$/, 'Please enter a valid Australian mobile phone number'),
  alternativePhone: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

interface CustomerDetailsFormProps {
  onSubmit: (data: CustomerForm) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
  submitSuccess?: boolean;
}

const titleOptions = [
  { value: 'mr', label: 'Mr' },
  { value: 'mrs', label: 'Mrs' },
  { value: 'ms', label: 'Ms' },
  { value: 'miss', label: 'Miss' },
  { value: 'dr', label: 'Dr' },
  { value: 'prof', label: 'Prof' },
];

const ConfirmationPolicyPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-600 hover:text-blue-800">
          <Info className="w-4 h-4 mr-1" />
          View Confirmation Policy
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Confirmation Policy</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• You will receive an email confirmation within 5 minutes</p>
            <p>• Please arrive 15 minutes early for your appointment</p>
            <p>• Cancellations must be made at least 24 hours in advance</p>
            <p>• For urgent appointments, please call us directly</p>
          </div>
          <div className="text-xs text-gray-500 border-t pt-2">
            <p>📧 Booking confirmation sent to your email</p>
            <p>📱 Mobile required for appointment updates</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  onSubmit,
  isSubmitting = false,
  submitError = null,
  submitSuccess = false
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onChange'
  });

  const onFormSubmit = async (data: CustomerFormData) => {
    await onSubmit(data);
  };

  if (submitSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <Alert className="max-w-md mx-auto">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Please arrive 15 minutes early for your appointment.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Details</h2>
        <p className="text-gray-600">Please provide your contact information to complete the booking</p>
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Title, First Name, Last Name Row */}
        <div className="grid grid-cols-12 gap-3">
          {/* Title */}
          <div className="col-span-3 space-y-1">
            <Label htmlFor="title">Title *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={cn(errors.title && "border-red-500")}>
                    <SelectValue placeholder="Title" />
                  </SelectTrigger>
                  <SelectContent>
                    {titleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* First Name */}
          <div className="col-span-4 space-y-1">
            <Label htmlFor="firstname">First Name *</Label>
            <Input
              id="firstname"
              {...register('firstname')}
              placeholder="First name"
              className={cn(errors.firstname && "border-red-500")}
            />
            {errors.firstname && (
              <p className="text-xs text-red-600">{errors.firstname.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="col-span-5 space-y-1">
            <Label htmlFor="lastname">Last Name *</Label>
            <Input
              id="lastname"
              {...register('lastname')}
              placeholder="Last name"
              className={cn(errors.lastname && "border-red-500")}
            />
            {errors.lastname && (
              <p className="text-xs text-red-600">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        {/* Birth Date */}
        <div className="space-y-1">
          <Label>Date of Birth *</Label>
          <Controller
            name="birthdate"
            control={control}
            render={({ field }) => (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      errors.birthdate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.birthdate && (
            <p className="text-xs text-red-600">{errors.birthdate.message}</p>
          )}
        </div>

        {/* Email and Mobile Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className={cn(errors.email && "border-red-500")}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile Phone */}
          <div className="space-y-1">
            <Label htmlFor="mobilePhone">Mobile Phone *</Label>
            <Input
              id="mobilePhone"
              type="tel"
              {...register('mobilePhone')}
              placeholder="0400 000 000"
              className={cn(errors.mobilePhone && "border-red-500")}
            />
            {errors.mobilePhone && (
              <p className="text-xs text-red-600">{errors.mobilePhone.message}</p>
            )}
          </div>
        </div>

        {/* Alternative Phone */}
        <div className="space-y-1">
          <Label htmlFor="alternativePhone">Alternative Phone Number</Label>
          <Input
            id="alternativePhone"
            type="tel"
            {...register('alternativePhone')}
            placeholder="02 1234 5678 (optional)"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Any additional information or special requirements..."
            rows={2}
          />
        </div>

        {/* Confirmation Policy Link */}
        <div className="pt-2 text-center">
          <ConfirmationPolicyPopover />
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-800 text-white py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking Appointment...
              </>
            ) : (
              'Book Appointment'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};