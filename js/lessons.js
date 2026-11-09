
const LESSONS = [
    {
        id: "fundamentos",
        title: "1. Fundamentos del enlace covalente",
        subtitle: "Comprende cómo los átomos comparten electrones.",
        sections: [
            {
                heading: "¿Qué es un enlace covalente?",
                content: "Es una unión química en la que dos átomos comparten uno o más pares de electrones para alcanzar una configuración electrónica más estable."
            },
            {
                heading: "Regla del octeto",
                content: "Establece que muchos átomos tienden a completar ocho electrones en su capa de valencia. Es una regla orientativa y tiene excepciones."
            },
            {
                heading: "Estructuras de Lewis",
                content: "Representan los electrones de valencia mediante puntos alrededor del símbolo químico. Los pares compartidos representan enlaces y los pares no compartidos se denominan pares libres."
            }
        ]
    },
    {
        id: "amoniaco",
        title: "2. Formación del amoníaco (NH₃)",
        subtitle: "Analiza la configuración electrónica del nitrógeno.",
        sections: [
            {
                diagram: `
       ..
       N
     / | \\
    H  H  H

  NH₃: tres enlaces N-H
  y un par electrónico libre.
`
            },
            {
                heading: "Configuración electrónica",
                content: "El nitrógeno tiene número atómico 7 y configuración electrónica 1s² 2s² 2p³. Posee cinco electrones de valencia."
            },
            {
                heading: "Formación de NH₃",
                content: "El nitrógeno comparte tres pares de electrones con tres átomos de hidrógeno. De esta manera se forman tres enlaces covalentes sencillos N–H y queda un par electrónico libre."
            },
            {
                heading: "Geometría molecular",
                content: "El amoníaco tiene geometría piramidal trigonal, debido a sus tres enlaces y un par electrónico libre. Su ángulo H–N–H es aproximadamente 107°."
            }
        ]
    },
    {
        id: "coordinado",
        title: "3. Enlace covalente coordinado",
        subtitle: "Conoce el enlace en el que un átomo aporta ambos electrones.",
        sections: [
            {
                heading: "Definición",
                content: "Es un enlace covalente en el que el par de electrones compartido procede inicialmente de un solo átomo."
            },
            {
                heading: "Donador y aceptor",
                content: "El donador aporta un par electrónico libre. El aceptor dispone de un orbital capaz de recibir ese par."
            },
            {
                heading: "Aplicación al amoníaco",
                content: "El nitrógeno del NH₃ actúa como donador porque posee un par electrónico libre. El protón H⁺ actúa como aceptor."
            }
        ]
    },
    {
        id: "amonio",
        title: "4. Formación del ion amonio (NH₄⁺)",
        subtitle: "Observa cómo se forma el ion amonio a partir del amoníaco.",
        sections: [
            {
                heading: "Reacción química",
                content: "NH₃ + H⁺ → NH₄⁺"
            },
            {
                heading: "Mecanismo de formación",
                content: "El nitrógeno dona su par electrónico libre al protón H⁺. Así se establece un cuarto enlace N–H y se forma el ion amonio."
            },
            {
                heading: "Geometría y carga",
                content: "El ion NH₄⁺ presenta geometría tetraédrica, cuatro enlaces N–H equivalentes y una carga total de +1. Su ángulo de enlace es aproximadamente 109.5°."
            },
            {
                heading: "Importancia química",
                content: "El ion amonio está presente en numerosas sales, como el cloruro de amonio y el nitrato de amonio. Este último tiene aplicaciones importantes en fertilizantes."
            }
        ]
    }
];
