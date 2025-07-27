import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Phone, Mail, Instagram, Users, Award, Sparkles, Scissors } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HomePage() {
  const serviceCategories = [
    {
      category: "BARBERÍA",
      services: [
        {
          name: "Barba",
          description: "Perfilado, recorte y definición para un look prolijo y moderno",
          price: "$30",
          duration: "30 min",
        },
      ],
    },
    {
      category: "CEJAS Y PESTAÑAS",
      services: [
        {
          name: "Laminado de Cejas",
          description: "Fijación semipermanente que ordena y realza la forma natural",
          price: "$45",
          duration: "45 min",
        },
        {
          name: "Laminado y Tinte de Cejas",
          description: "Laminado + color para un acabado más definido y duradero",
          price: "$55",
          duration: "60 min",
        },
        {
          name: "Lifting de Pestañas",
          description: "Curvado natural que abre la mirada sin necesidad de extensiones",
          price: "$50",
          duration: "45 min",
        },
        {
          name: "Lifting + Tinte + Laminado",
          description: "Mirada impactante: combina curva, color y fijación",
          price: "$70",
          duration: "75 min",
        },
        {
          name: "Perfilado de Cejas",
          description: "Diseño y depilación según la forma de tu rostro",
          price: "$25",
          duration: "30 min",
        },
      ],
    },
    {
      category: "COLORACIÓN",
      services: [
        {
          name: "Balayage con Martín Carrizo",
          description: "Técnica personalizada por un especialista para lograr luces naturales",
          price: "$120",
          duration: "180 min",
        },
        {
          name: "Balayage Hair Carrizo",
          description: "Efecto de mechas difuminadas, con estilo profesional exclusivo",
          price: "$100",
          duration: "150 min",
        },
        {
          name: "Baño de Luz",
          description: "Reflejos de brillo y tono para revitalizar el color",
          price: "$60",
          duration: "90 min",
        },
        {
          name: "Color Inoa (solo raíces)",
          description: "Coloración sin amoníaco que respeta la fibra capilar",
          price: "$45",
          duration: "60 min",
        },
        {
          name: "Color Majirel",
          description: "Cobertura total con colores intensos y duraderos",
          price: "$55",
          duration: "75 min",
        },
        {
          name: "Maquillaje de Mechas",
          description: "Reflejos suaves y estratégicos para resaltar zonas puntuales",
          price: "$70",
          duration: "90 min",
        },
        {
          name: "Mechas con Gorra",
          description: "Técnica clásica para iluminar el cabello desde la raíz",
          price: "$65",
          duration: "90 min",
        },
      ],
    },
    {
      category: "CORTE",
      services: [
        {
          name: "Corte de Caballero",
          description: "Estilo moderno o clásico, según tu personalidad",
          price: "$35",
          duration: "45 min",
        },
        {
          name: "Corte de Damas",
          description: "Adaptado a tus rasgos y estilo, para realzar tu belleza",
          price: "$40",
          duration: "50 min",
        },
        {
          name: "Corte de Niñas",
          description: "Cortes delicados pensados para las más pequeñas",
          price: "$25",
          duration: "30 min",
        },
        {
          name: "Corte de Niños",
          description: "Rápido y cómodo para los más chicos, con estilo",
          price: "$20",
          duration: "25 min",
        },
      ],
    },
    {
      category: "DECOLORACIÓN",
      services: [
        {
          name: "Limpieza de Color",
          description: "Remueve restos de color previo para aplicar uno nuevo",
          price: "$80",
          duration: "120 min",
        },
        {
          name: "Mechas Platinium",
          description: "Iluminación extrema con tonos fríos y brillantes",
          price: "$90",
          duration: "150 min",
        },
        {
          name: "Mechas Platinium con Martín Carrizo",
          description: "Técnica avanzada para resultados premium",
          price: "$130",
          duration: "180 min",
        },
      ],
    },
    {
      category: "FORMA",
      services: [
        {
          name: "Keratina",
          description: "Suaviza, hidrata y elimina el frizz por semanas",
          price: "$85",
          duration: "120 min",
        },
        {
          name: "Nano Keratina",
          description: "Tratamiento más intensivo que reestructura profundamente el cabello",
          price: "$110",
          duration: "150 min",
        },
      ],
    },
    {
      category: "PEINADOS",
      services: [
        {
          name: "Brushing",
          description: "Secado con volumen, brillo y forma",
          price: "$25",
          duration: "30 min",
        },
        {
          name: "Modelado",
          description: "Peinado con ondas, planchita o bucles según tu estilo",
          price: "$35",
          duration: "45 min",
        },
        {
          name: "Peinados Especiales",
          description: "Recogidos, semis o estilizados para eventos y ocasiones especiales",
          price: "$50",
          duration: "60 min",
        },
      ],
    },
  ]

  const team = [
    {
      name: "MARTÍN CARRIZO",
      specialty: "DIRECTOR CREATIVO & COLORISTA MASTER",
      experience: "15 años",
      description: "Especialista en técnicas avanzadas de coloración y balayage",
      avatar: "MC",
      avatar_url: "/placeholder.svg?height=128&width=128", // Añadir esta línea
    },
    {
      name: "ALEJANDRO CARRIZO",
      specialty: "ESTILISTA SENIOR",
      experience: "12 años",
      description: "Experto en cortes de vanguardia y transformaciones capilares",
      avatar: "AC",
      avatar_url: "/placeholder.svg?height=128&width=128", // Añadir esta línea
    },
    {
      name: "SOFIA MARTINEZ",
      specialty: "ESPECIALISTA EN CEJAS Y PESTAÑAS",
      experience: "8 años",
      description: "Maestra en laminados, lifting y diseño de cejas",
      avatar: "SM",
      avatar_url: "/placeholder.svg?height=128&width=128", // Añadir esta línea
    },
    {
      name: "VALENTINA CRUZ",
      specialty: "ESTILISTA & COLORISTA",
      experience: "10 años",
      description: "Especializada en peinados y técnicas de coloración",
      avatar: "VC",
      avatar_url: "/placeholder.svg?height=128&width=128", // Añadir esta línea
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Hair Carrizo Logo" width={200} height={80} className="h-12 w-auto" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#nosotros" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Nosotros
              </a>
              <a href="#servicios" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Servicios
              </a>
              <a href="#equipo" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Equipo
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                Contacto
              </a>
              <a
                href="https://www.instagram.com/haircarrizo/?hl=es"
                className="text-gray-700 hover:text-amber-600 font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Síguenos en Instagram
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/hair-carrizo-salon-exterior.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Sparkles className="h-16 w-16 text-amber-300 mx-auto mb-6" />
          </div>
          <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-wider">HAIR CARRIZO</h1>
          <div className="w-32 h-px bg-amber-300 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-amber-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            DONDE LA BELLEZA SE ENCUENTRA CON LA EXCELENCIA
            <br />
            <span className="text-lg">Más de 15 años creando looks únicos y transformaciones extraordinarias</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/reservar">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 text-lg font-medium tracking-wide shadow-xl"
              >
                RESERVAR CITA
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-amber-900 px-12 py-4 text-lg font-medium tracking-wide bg-transparent"
            >
              VER SERVICIOS
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-wide">NOSOTROS</h2>
            <div className="w-24 h-px bg-amber-600 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-light text-gray-900 mb-6">Nuestra Historia</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Hair Carrizo nació de la pasión por la belleza y el arte capilar. Con más de 15 años de experiencia,
                hemos perfeccionado nuestras técnicas para ofrecer servicios de la más alta calidad, combinando
                tradición y vanguardia.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Nuestro compromiso es realzar la belleza natural de cada cliente, creando looks únicos que reflejen su
                personalidad y estilo de vida.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-amber-600 mb-2">15+</div>
                  <div className="text-gray-600 font-medium">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-amber-600 mb-2">5000+</div>
                  <div className="text-gray-600 font-medium">Clientes Satisfechos</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="h-96 rounded-lg shadow-2xl"
                style={{
                  backgroundImage: `url('/images/hair-wash-salon.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-light text-gray-900 mb-4">Reconocimiento y Confianza</h3>
              <p className="text-gray-600 text-lg">La preferencia de miles de clientes nos respalda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Instagram className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <div className="text-3xl font-light text-gray-900 mb-2">22K+</div>
                  <div className="text-gray-600 font-medium">Seguidores en Instagram</div>
                  <p className="text-sm text-gray-500 mt-2">Una comunidad que confía en nuestro trabajo</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <div className="text-3xl font-light text-gray-900 mb-2">VIP</div>
                  <div className="text-gray-600 font-medium">Clientes Famosos</div>
                  <p className="text-sm text-gray-500 mt-2">Personalidades del espectáculo confían en nosotros</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <div className="text-3xl font-light text-gray-900 mb-2">TOP</div>
                  <div className="text-gray-600 font-medium">Salón Reconocido</div>
                  <p className="text-sm text-gray-500 mt-2">Referente en técnicas de coloración y estilo</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-lg italic mb-6">
                "La confianza de nuestros clientes y el reconocimiento de la industria nos motivan a seguir innovando
                cada día"
              </p>
              <div className="flex justify-center">
                <Link href="https://www.instagram.com/haircarrizo/?hl=es" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white bg-transparent"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Síguenos en Instagram
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-wide">NUESTROS SERVICIOS</h2>
            <div className="w-24 h-px bg-amber-600 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Servicios especializados con técnicas de vanguardia y productos premium para lograr resultados
              excepcionales
            </p>
          </div>

          <div className="space-y-16">
            {/* Versión para escritorio (oculta en móvil) */}
            <div className="hidden md:block">
              {serviceCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-light text-amber-700 mb-4 tracking-widest">
                      {category.category}
                    </h3>
                    <div className="w-16 h-px bg-amber-400 mx-auto"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.services.map((service, serviceIndex) => (
                      <Card
                        key={serviceIndex}
                        className="group hover:shadow-xl transition-all duration-300 border-amber-100 hover:border-amber-300 bg-white/80 backdrop-blur-sm"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start mb-3">
                            <CardTitle className="text-lg font-medium text-gray-900 group-hover:text-amber-700 transition-colors leading-tight">
                              {service.name}
                            </CardTitle>
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800 font-medium border-amber-200"
                            >
                              {service.price}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center text-gray-500 mb-3">
                            <Clock className="h-4 w-4 mr-2 text-amber-600" />
                            <span>{service.duration}</span>
                          </CardDescription>
                          <CardDescription className="text-gray-600 leading-relaxed">
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Versión para móvil (oculta en escritorio) */}
            <div className="md:hidden">
              <Accordion type="single" collapsible className="w-full">
                {serviceCategories.map((category, categoryIndex) => (
                  <AccordionItem key={categoryIndex} value={`item-${categoryIndex}`}>
                    <AccordionTrigger className="text-lg font-medium text-amber-700 hover:no-underline">
                      {category.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
                        {category.services.map((service, serviceIndex) => (
                          <Card
                            key={serviceIndex}
                            className="group hover:shadow-xl transition-all duration-300 border-amber-100 hover:border-amber-300 bg-white/80 backdrop-blur-sm"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex justify-between items-start mb-3">
                                <CardTitle className="text-base font-medium text-gray-900 group-hover:text-amber-700 transition-colors leading-tight">
                                  {service.name}
                                </CardTitle>
                                <Badge
                                  variant="secondary"
                                  className="bg-amber-100 text-amber-800 font-medium border-amber-200"
                                >
                                  {service.price}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center text-gray-500 mb-3 text-sm">
                                <Clock className="h-3 w-3 mr-1 text-amber-600" />
                                <span>{service.duration}</span>
                              </CardDescription>
                              <CardDescription className="text-gray-600 text-sm leading-relaxed">
                                {service.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-wide">NUESTRO EQUIPO</h2>
            <div className="w-24 h-px bg-amber-600 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Profesionales altamente capacitados con años de experiencia y pasión por la excelencia en cada servicio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-amber-100 hover:border-amber-300 bg-gradient-to-b from-white to-amber-50/30"
              >
                <CardHeader className="text-center pb-6">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow overflow-hidden">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url || "/placeholder.svg"}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-2xl font-light text-white tracking-wider">{member.avatar}</span>
                    )}
                  </div>
                  <CardTitle className="text-lg font-medium text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="mb-4">
                    <span className="text-amber-600 font-medium mb-2 block">{member.specialty}</span>
                    <span className="text-gray-500 text-sm mb-3 block">{member.experience} de experiencia</span>
                    <span className="text-gray-600 text-sm leading-relaxed block">{member.description}</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('/placeholder.svg?height=400&width=1200')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Scissors className="h-16 w-16 text-amber-200 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide">¿LISTO PARA TU TRANSFORMACIÓN?</h2>
          <div className="w-24 h-px bg-amber-200 mx-auto mb-8"></div>
          <p className="text-amber-100 text-xl mb-12 leading-relaxed">
            Reserva tu cita y déjanos crear el look perfecto que refleje tu personalidad única
          </p>
          <Link href="/reservar">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-amber-700 hover:bg-amber-50 px-12 py-4 text-lg font-medium tracking-wide shadow-xl"
            >
              RESERVAR AHORA
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-wide">CONTÁCTANOS</h2>
            <div className="w-24 h-px bg-amber-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="text-center bg-white shadow-lg border-amber-100">
              <CardContent className="p-8">
                <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-6" />
                <h3 className="font-medium text-gray-900 mb-4 text-lg">UBICACIÓN</h3>
                <p className="text-gray-600 leading-relaxed">
                  Av. Corrientes 1234
                  <br />
                  CABA, Buenos Aires
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white shadow-lg border-amber-100">
              <CardContent className="p-8">
                <Phone className="h-12 w-12 text-amber-600 mx-auto mb-6" />
                <h3 className="font-medium text-gray-900 mb-4 text-lg">TELÉFONO</h3>
                <p className="text-gray-600">+54 11 1234-5678</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white shadow-lg border-amber-100">
              <CardContent className="p-8">
                <Mail className="h-12 w-12 text-amber-600 mx-auto mb-6" />
                <h3 className="font-medium text-gray-900 mb-4 text-lg">EMAIL</h3>
                <p className="text-gray-600">info@haircarrizo.com</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center space-x-8 mt-16">
            <Link href="https://www.instagram.com/haircarrizo/?hl=es" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-8 w-8 text-gray-400 hover:text-amber-600 cursor-pointer transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Image src="/logo.png" alt="Hair Carrizo Logo" width={200} height={80} className="h-10 w-auto mx-auto mb-6" />
          <p className="text-gray-400">© 2024 HAIR CARRIZO. TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  )
}
