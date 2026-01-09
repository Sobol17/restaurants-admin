<script setup>
import {ref} from 'vue'
import {useAuthApi} from '@/services/useAuth'
import {handlePhoneInput as formatPhoneInput, validatePhone} from '@/utils/formatPhoneNumber'
import {normalizePhoneString} from "@/utils/normalizePhoneString";

const phone = ref('')
const password = ref('')
const userName = ref('')
const checked = ref(false)
const phoneError = ref('')

const {registerMutation} = useAuthApi()

const {mutate: register, isError} = registerMutation

const handlePhoneInput = event => {
  phone.value = formatPhoneInput(event.target.value)
}

const handleLogin = () => {
  if (!validatePhone(phone.value)) {
    phoneError.value = 'Введите корректный номер телефона'
    return
  }
  phoneError.value = ''


  register({
    phone: normalizePhoneString(phone.value),
    password: password.value,
    name: userName.value,
    role: 'admin'
  })
}
</script>

<template>
  <div
      class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <div
          style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
        "
      >
        <div
            class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
            style="border-radius: 53px"
        >
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
              Регистрация
            </div>
            <span class="text-muted-color font-medium">Зарегистрируйтесь, чтобы пользоваться системой</span>
          </div>

          <div>
            <label
                for="phone"
                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
            >Телефон</label
            >
            <InputText
                id="phone"
                type="tel"
                pattern="[0-9]*"
                inputmode="numeric"
                placeholder="+7 (999) 999-99-99"
                class="w-full md:w-[30rem] mb-2"
                v-model="phone"
                @input="handlePhoneInput"
                maxlength="18"
                :invalid="phoneError !== '' || isError"
            />
            <small class="text-red-500 block mb-6" v-if="phoneError">{{ phoneError }}</small>

            <label
                for="name"
                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
            >Имя</label
            >
            <InputText
                id="name"
                type="text"
                placeholder="Ваше имя"
                class="w-full md:w-[30rem] mb-2"
                v-model="userName"
                maxlength="18"
            />

            <label
                for="password1"
                class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
            >Пароль</label
            >
            <Password
                id="password1"
                v-model="password"
                placeholder="Password"
                :toggleMask="true"
                class="mb-4"
                fluid
                :feedback="false"
                :invalid="isError"
            ></Password>

            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
              <div class="flex items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Запомнить</label>
              </div>
            </div>
            <small class="text-red-500 block mb-6" v-if="isError">Неверные данные для входа</small>
            <Button label="Войти" class="w-full" @click="handleLogin"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
