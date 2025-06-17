// src/components/booking/CustomerDetailsForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  onSubmit,
  isSubmitting = false,
  submitError = null,
  submitSuccess = false
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onChange'
  });

  const selectedTitle = watch('title');
  const selectedBirthdate = watch('birthdate');

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

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Select
            value={selectedTitle}
            onValueChange={(value) => setValue('title', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              {titleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstname">First Name *</Label>
          <Input
            id="firstname"
            {...register('firstname')}
            placeholder="Enter your first name"
            className={errors.firstname ? 'border-red-500' : ''}
          />
          {errors.firstname && (
            <p className="text-sm text-red-600">{errors.firstname.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastname">Last Name *</Label>
          <Input
            id="lastname"
            {...register('lastname')}
            placeholder="Enter your last name"
            className={errors.lastname ? 'border-red-500' : ''}
          />
          {errors.lastname && (
            <p className="text-sm text-red-600">{errors.lastname.message}</p>
          )}
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedBirthdate && "text-muted-foreground",
                  errors.birthdate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedBirthdate ? format(selectedBirthdate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedBirthdate}
                onSelect={(date) => setValue('birthdate', date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.birthdate && (
            <p className="text-sm text-red-600">{errors.birthdate.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email address"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="text-xs text-gray-500">
            We will send you a booking confirmation to your email address provided
          </p>
        </div>

        {/* Mobile Phone */}
        <div className="space-y-2">
          <Label htmlFor="mobilePhone">Mobile Phone *</Label>
          <Input
            id="mobilePhone"
            type="tel"
            {...register('mobilePhone')}
            placeholder="0400 000 000"
            className={errors.mobilePhone ? 'border-red-500' : ''}
          />
          {errors.mobilePhone && (
            <p className="text-sm text-red-600">{errors.mobilePhone.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Mobile number required to confirm appointment and inform of any changes to appointment
          </p>
        </div>

        {/* Alternative Phone */}
        <div className="space-y-2">
          <Label htmlFor="alternativePhone">Alternative Phone Number</Label>
          <Input
            id="alternativePhone"
            type="tel"
            {...register('alternativePhone')}
            placeholder="02 1234 5678 (optional)"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Any additional information or special requirements..."
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
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

        {/* Confirmation Policy */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Confirmation Policy</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• You will receive an email confirmation within 5 minutes</p>
            <p>• Please arrive 15 minutes early for your appointment</p>
            <p>• Cancellations must be made at least 24 hours in advance</p>
            <p>• For urgent appointments, please call us directly</p>
          </div>
        </div>
      </form>
    </div>
  );
};