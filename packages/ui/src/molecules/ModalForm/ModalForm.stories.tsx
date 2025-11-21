import type { Meta, StoryObj } from "@storybook/react";
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalForm, ModalFormItem, ModalFormField, ModalFormContainer } from "./ModalForm.component";
import { Input } from "../../atoms/input/input.component";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../atoms/select/select.component';
import { Button } from '../../atoms/button/button.component';

const meta: Meta<typeof ModalForm> = {
  title: "Molecules/ModalForm",
  component: ModalForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModalForm>;

const userFormSchema = z.object({
  username: z.string().min(4, {
    message: '아이디는 최소 4글자 이상이어야 합니다.'
  }), 
  name: z.string().min(2, {
    message: '이름은 최소 2글자 이상이어야 합니다.'
  }),
  password: z.string().min(8, {
    message: '비밀번호는 최소 8글자 이상이어야 합니다.'
  }),
  userGroup: z.string().min(1, {
    message: '사용자 그룹을 선택해주세요.'
  }),
  phone: z.string().regex(/^[0-9-]+$/, {
    message: '올바른 전화번호 형식을 입력해주세요.'
  }),
  department: z.string().min(1, {
    message: '부서명을 입력해주세요.'
  })
});

const simpleFormSchema = z.object({
  name: z.string().min(1, {
    message: '이름을 입력해주세요.'
  }),
  email: z.string().email({
    message: '올바른 이메일 형식을 입력해주세요.'
  })
});

const detailedFormSchema = z.object({
  title: z.string().min(1, {
    message: '제목을 입력해주세요.'
  }),
  description: z.string().min(10, {
    message: '설명은 최소 10글자 이상이어야 합니다.'
  }),
  category: z.string().min(1, {
    message: '카테고리를 선택해주세요.'
  }),
  priority: z.string().min(1, {
    message: '우선순위를 선택해주세요.'
  })
});

export const Default: Story = {
  render: function Render() {
    const form = useForm<z.infer<typeof userFormSchema>>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        username: '',
        name: '',
        password: '',
        userGroup: '',
        phone: '',
        department: ''
      },
      mode: 'onChange',
    });

    const onSubmit = (values: z.infer<typeof userFormSchema>) => {
      console.log('Form submitted:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <ModalForm {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <ModalFormContainer>
            <ModalFormField>
              <Controller
                name="username"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="아이디" 
                    description="4글자 이상의 아이디를 입력해주세요."
                    message={form.formState.errors.username?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="아이디를 입력하세요"
                      aria-label="아이디"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>

            <ModalFormField>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="사용자명" 
                    message={form.formState.errors.name?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="사용자명을 입력하세요"
                      aria-label="사용자명"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="비밀번호" 
                    message={form.formState.errors.password?.message}
                  >
                    <Input 
                      {...field}
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      aria-label="비밀번호"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="userGroup"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="사용자 그룹" 
                    message={form.formState.errors.userGroup?.message}
                  >
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="사용자 그룹">
                        <SelectValue placeholder="그룹 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">관리자</SelectItem>
                        <SelectItem value="user">일반 사용자</SelectItem>
                        <SelectItem value="guest">게스트</SelectItem>
                      </SelectContent>
                    </Select>
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="연락처" 
                    description="하이픈(-)을 포함하여 입력해주세요."
                    message={form.formState.errors.phone?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="010-1234-5678"
                      aria-label="연락처"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="department"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="부서명" 
                    message={form.formState.errors.department?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="부서명을 입력하세요"
                      aria-label="부서명"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
          </ModalFormContainer>
            
          <div className="mt-6 flex justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              초기화
            </Button>
            <Button type="submit">
              등록
            </Button>
          </div>
        </form>
      </ModalForm>
    );
  }
};

export const Simple: Story = {
  render: function Render() {
    const form = useForm<z.infer<typeof simpleFormSchema>>({
      resolver: zodResolver(simpleFormSchema),
      defaultValues: {
        name: '',
        email: ''
      },
      mode: 'onChange',
    });

    const onSubmit = (values: z.infer<typeof simpleFormSchema>) => {
      console.log('Form submitted:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <ModalForm {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <ModalFormContainer>
            <ModalFormField>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="이름" 
                    message={form.formState.errors.name?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="이름을 입력하세요"
                      aria-label="이름"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>

            <ModalFormField>
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="이메일" 
                    message={form.formState.errors.email?.message}
                  >
                    <Input 
                      {...field}
                      type="email"
                      placeholder="example@company.com"
                      aria-label="이메일"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
          </ModalFormContainer>
            
          <div className="mt-6 flex justify-center">
            <Button type="submit">
              제출
            </Button>
          </div>
        </form>
      </ModalForm>
    );
  }
};

export const WithDescription: Story = {
  render: function Render() {
    const form = useForm<z.infer<typeof detailedFormSchema>>({
      resolver: zodResolver(detailedFormSchema),
      defaultValues: {
        title: '',
        description: '',
        category: '',
        priority: ''
      },
      mode: 'onChange',
    });

    const onSubmit = (values: z.infer<typeof detailedFormSchema>) => {
      console.log('Form submitted:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <ModalForm {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <ModalFormContainer>
            <ModalFormField>
              <Controller
                name="title"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="제목" 
                    description="작업의 제목을 입력해주세요."
                    message={form.formState.errors.title?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="제목을 입력하세요"
                      aria-label="제목"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>

            <ModalFormField>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="설명" 
                    description="작업에 대한 상세 설명을 입력해주세요. (최소 10글자)"
                    message={form.formState.errors.description?.message}
                  >
                    <textarea
                      {...field}
                      placeholder="설명을 입력하세요"
                      aria-label="설명"
                      className="min-h-[100px] w-full px-3 py-2 border border-[#bbbfcf] rounded-[7px] resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>

            <ModalFormField>
              <Controller
                name="category"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="카테고리" 
                    description="작업의 카테고리를 선택해주세요."
                    message={form.formState.errors.category?.message}
                  >
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="카테고리">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">버그 수정</SelectItem>
                        <SelectItem value="feature">기능 추가</SelectItem>
                        <SelectItem value="improvement">개선</SelectItem>
                        <SelectItem value="documentation">문서화</SelectItem>
                      </SelectContent>
                    </Select>
                  </ModalFormItem>
                )}
              />
            </ModalFormField>

            <ModalFormField>
              <Controller
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="우선순위" 
                    description="작업의 우선순위를 선택해주세요."
                    message={form.formState.errors.priority?.message}
                  >
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="우선순위">
                        <SelectValue placeholder="우선순위 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">낮음</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="high">높음</SelectItem>
                        <SelectItem value="urgent">긴급</SelectItem>
                      </SelectContent>
                    </Select>
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
          </ModalFormContainer>
            
          <div className="mt-6 flex justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              초기화
            </Button>
            <Button type="submit">
              저장
            </Button>
          </div>
        </form>
      </ModalForm>
    );
  }
};

export const WithValidation: Story = {
  render: function Render() {
    const form = useForm<z.infer<typeof userFormSchema>>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        username: '',
        name: '',
        password: '',
        userGroup: '',
        phone: '',
        department: ''
      },
      mode: 'onBlur',
    });

    const onSubmit = (values: z.infer<typeof userFormSchema>) => {
      console.log('Form submitted:', values);
      alert('폼 검증 성공!\n' + JSON.stringify(values, null, 2));
    };

    return (
      <ModalForm {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <ModalFormContainer>
            <ModalFormField>
              <Controller
                name="username"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="아이디" 
                    description="4글자 이상 입력해주세요."
                    message={form.formState.errors.username?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="아이디를 입력하세요"
                      aria-label="아이디"
                      aria-invalid={!!form.formState.errors.username}
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>

            <ModalFormField>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="사용자명" 
                    message={form.formState.errors.name?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="사용자명을 입력하세요"
                      aria-label="사용자명"
                      aria-invalid={!!form.formState.errors.name}
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="비밀번호" 
                    description="8글자 이상의 비밀번호를 입력해주세요."
                    message={form.formState.errors.password?.message}
                  >
                    <Input 
                      {...field}
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      aria-label="비밀번호"
                      aria-invalid={!!form.formState.errors.password}
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="userGroup"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="사용자 그룹" 
                    message={form.formState.errors.userGroup?.message}
                  >
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger 
                        aria-label="사용자 그룹"
                        state={form.formState.errors.userGroup ? "error" : "default"}
                      >
                        <SelectValue placeholder="그룹 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">관리자</SelectItem>
                        <SelectItem value="user">일반 사용자</SelectItem>
                        <SelectItem value="guest">게스트</SelectItem>
                      </SelectContent>
                    </Select>
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="연락처" 
                    description="예: 010-1234-5678"
                    message={form.formState.errors.phone?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="010-1234-5678"
                      aria-label="연락처"
                      aria-invalid={!!form.formState.errors.phone}
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
            
            <ModalFormField>
              <Controller
                name="department"
                control={form.control}
                render={({ field }) => (
                  <ModalFormItem 
                    label="부서명" 
                    message={form.formState.errors.department?.message}
                  >
                    <Input 
                      {...field}
                      placeholder="부서명을 입력하세요"
                      aria-label="부서명"
                      aria-invalid={!!form.formState.errors.department}
                    />
                  </ModalFormItem>
                )}
              />
            </ModalFormField>
          </ModalFormContainer>
            
          <div className="mt-6 flex justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              초기화
            </Button>
            <Button type="submit">
              등록
            </Button>
          </div>
        </form>
      </ModalForm>
    );
  }
};
