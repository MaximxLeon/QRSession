export type LoginData = {
  login: string
  password: string
}

export type LoginResponse = {
  redirect: string
}

export async function loginUser(
  credentials: LoginData
): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: credentials.login.trim(),
      password: credentials.password
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось войти')
  }

  return data as LoginResponse
}
